export interface AppSettingsType {
    _id: string;
    key: string;
    general: {
        websiteName: string;
        logoUrl: string;
        websiteUrl: string;
        websiteDescription: string;
        adminEmail: string;
        marqueeText: string;
        address: string;
        socialLinks: {
            twitter: string;
            facebook: string;
            instagram: string;
            linkedin: string;
            youtube: string;
        };
    };
    aboutUs: {
        title: string;
        summary: string;
        sections: {
            title?: string;
            image?: string;
            description: string;
        }[];
    };
    contactUs: {
        title: string;
        description: string;
        email: string;
        phone: string;
        address: string;
    };
    faqs: {
        name: string;
        summary: string;
        questions: {
            question: string;
            answer: string;
        }[];
    };
    security?: {
        lockPassword: string;
        smtpHost: string;
        smtpPort: number;
        smtpUser: string;
        smtpPass: string;
    };
}
