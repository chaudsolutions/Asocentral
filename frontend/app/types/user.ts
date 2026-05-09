export interface UserType {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    kycStatus?: boolean;
    kycDetails?: {
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        occupation?: string;
        age?: number;
        zip?: string;
        idCardImage?: string;
        idCardBackImage?: string;
    };
    createdAt?: string;
    updatedAt?: string;
    pendingUnpublishedNews?: number;
}

export type UserRole = UserType["role"];
