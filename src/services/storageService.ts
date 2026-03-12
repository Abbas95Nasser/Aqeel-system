import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { storage } from "../lib/firebase";

export const storageService = {
  // Upload a file to a specific path
  async uploadFile(file: File | Blob, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  // Upload an image (special handling if needed)
  async uploadMemberImage(memberId: string, type: string, file: File | Blob): Promise<string> {
    const path = `members/${memberId}/${type}_${Date.now()}`;
    return this.uploadFile(file, path);
  },

  // Delete a file by URL
  async deleteFile(url: string) {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  }
};
