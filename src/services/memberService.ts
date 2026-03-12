import { 
  collection, 
  setDoc,
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  runTransaction,
  Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Member } from "../types";

const COLLECTION_NAME = "members";
const COUNTERS_COLLECTION = "counters";

export const memberService = {
  // Helper to get next sequential ID
  async getNextId(): Promise<string> {
    const counterRef = doc(db, COUNTERS_COLLECTION, "memberId");
    
    return await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let nextId = 1;
      
      if (counterSnap.exists()) {
        nextId = counterSnap.data().current + 1;
      }
      
      transaction.set(counterRef, { current: nextId });
      
      // Format to 6 digits with leading zeros (e.g., 000001)
      return nextId.toString().padStart(6, '0');
    });
  },

  // Add a new member
  async addMember(member: Omit<Member, 'metadata'>, adminUid: string) {
    const nextId = await this.getNextId();
    const docRef = doc(db, COLLECTION_NAME, nextId);
    
    await setDoc(docRef, {
      ...member,
      id: nextId, // Store the sequential ID in the document as well
      metadata: {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: adminUid
      }
    });
    
    return nextId;
  },

  // Update an existing member
  async updateMember(docId: string, member: Partial<Member>) {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await updateDoc(docRef, {
      ...member,
      "metadata.updatedAt": serverTimestamp()
    });
  },

  // Get a single member by Firestore Document ID
  async getMember(docId: string): Promise<Member | null> {
    const docRef = doc(db, COLLECTION_NAME, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Member;
    }
    return null;
  },

  // Get all members
  async getAllMembers(): Promise<Member[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy("metadata.createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Member));
  },

  // Search members by name, phone, or governorate
  async searchMembers(searchQueryStr: string): Promise<Member[]> {
    // Note: Firestore doesn't support full-text search out of the box.
    // We'll do a simple startAt/endAt for prefixes if needed, but for simplicity
    // and given the "thousands of members" requirement, we might need to fetch
    // and filter client-side or use Algolia.
    // For now, let's fetch all and filter client-side as requested.
    return this.getAllMembers();
  },

  // Delete a member
  async deleteMember(docId: string) {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await deleteDoc(docRef);
  },

  // Get stats for dashboard
  async getStats() {
    const members = await this.getAllMembers();
    const statsByGov: Record<string, number> = {};
    
    members.forEach(m => {
      const gov = m.governorate || 'غير محدد';
      statsByGov[gov] = (statsByGov[gov] || 0) + 1;
    });

    return {
      total: members.length,
      byGovernorate: statsByGov,
      recent: members.slice(0, 5)
    };
  }
};
