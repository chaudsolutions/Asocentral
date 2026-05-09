export interface PersonalityType {
    _id: string;
    title: string;
    description: string;
    image: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
