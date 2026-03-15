export interface Member {
  id: string; // Sequential numeric ID (e.g. 000001)
  name: string;
  phone: string;
  governorate: string;
  dateAdded: string;
  timestamp: number;
  personalInformation: {
    fullName: string;
    fatherName: string;
    motherName: string;
    birthYear: string;
    nationality: string;
    ethnicity: string;
    height: string;
    weight: string;
    healthStatus: string;
    healthNotes: string;
    socialStatus: string;
  };
  housingInformation: {
    governorate: string;
    district: string;
    neighborhood: string;
    zukaq: string;
    dar: string;
    nearestLandmark: string;
    phone: string;
  };
  previousHousing?: {
    governorate: string;
    district: string;
    neighborhood: string;
    zukaq: string;
    dar: string;
    nearestLandmark: string;
    phone: string;
  };
  familyInformation: {
    totalMembers: string;
    males: string;
    females: string;
    wivesCount: string;
    relationship: string;
  };
  educationInformation: {
    level: string;
    graduationYear: string;
    institution: string;
    address: string;
    specialization: string;
  };
  workInformation: {
    incomeStatus: string;
    isWorking: boolean;
    details: {
      government?: string;
      private?: string;
      mixed?: string;
      address?: string;
      jobTitle?: string;
      startDate?: string;
      workingHours?: string;
      monthlyIncome?: string;
    };
  };
  politicalInformation: {
    hasAffiliation: boolean;
    affiliationDetails: string;
    hasCivilSocietyInvolvement: boolean;
    civilSocietyDetails: string;
    isMshmoolBaath: boolean;
    baathDetails: string;
  };
  religiousInformation: {
    sect: string;
    reference: string;
  };
  judicialInformation: {
    questions: boolean[];
    history: Array<{
      date: string;
      type: string;
      reason: string;
      location: string;
      result: string;
    }>;
  };
  additionalInformation: {
    travels: Array<{
      country: string;
      date: string;
      duration: string;
      purpose: string;
    }>;
    communication: Array<{
      type: string;
      phone: string;
      socialMedia: string;
    }>;
    skills: string[];
    experiences: Array<{
      title: string;
      imageUrl?: string;
    }>;
  };
  pledgeInformation: {
    organizerName: string;
    organizerDate: string;
    organizerSignature: string;
    ownerName: string;
    ownerDate: string;
    ownerSignature: string;
  };
  documents: {
    personalPhotoUrl?: string;
    nationalIdFrontUrl?: string;
    nationalIdBackUrl?: string;
    residenceCardFrontUrl?: string;
    residenceCardBackUrl?: string;
    voterCardFrontUrl?: string;
    voterCardBackUrl?: string;
    customIds: Array<{
      title: string;
      images: string[];
    }>;
  };
  metadata: {
    createdAt: any; // Firestore Timestamp
    updatedAt: any; // Firestore Timestamp
    createdBy: string;
  };
}
