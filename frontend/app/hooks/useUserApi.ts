import axios from "axios";
import { serVer } from "~/utils/constants";
import { getAdminToken, getUserToken } from "./useTools";
import type { UserRole, UserType } from "~/types/user";
import type { NewsPayload } from "./useNewsDataApi";
import type { UnpublishedNewsType } from "~/types/news";
import type { NotificationType } from "~/types/others";
import type { PersonalityType } from "~/types/personality";
import type { AppSettingsType } from "~/types/settings";

export type UserPayload = {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
};

export type KycPayload = {
    firstName: string;
    lastName: string;
    address: string;
    city?: string;
    state: string;
    country: string;
    occupation: string;
    age: number;
    zip?: string;
    idCardImage: string | File; // Front of ID card
    idCardBackImage: string | File; // Back of ID card
};

export type AdminDashboardData = {
    stats: {
        totalUsers: number;
        usersWithNews: number;
        publishedNews: number;
        unpublishedNews: number;
        activeNews: number;
        inactiveNews: number;
    };
    charts: {
        topDownloadedNews: { _id: string; title: string; downloads: number }[];
        topSharedNews: { _id: string; title: string; shares: number }[];
        topViewedNews: { _id: string; title: string; views: number }[];
        topCommentedNews: {
            _id: string;
            title: string;
            commentsCount: number;
        }[];
        topJournalists: {
            _id: string;
            name: string;
            submissions: number;
            posted: number;
        }[];
    };
};

export type UserDashboardData = {
    stats: {
        publishedNews: number;
        unpublishedNews: number;
    };
    charts: {
        topDownloadedNews: { _id: string; title: string; downloads: number }[];
        topSharedNews: { _id: string; title: string; shares: number }[];
        topViewedNews: { _id: string; title: string; views: number }[];
        topCommentedNews: {
            _id: string;
            title: string;
            commentsCount: number;
        }[];
    };
};

export type NotificationsResponse = {
    notifications: NotificationType[];
    unreadCount: number;
};

const getAdminAuthHeader = () => {
    const { token } = getAdminToken();
    return { Authorization: `Bearer ${token}` };
};

const getUserAuthHeader = () => {
    const { token } = getUserToken();
    return { Authorization: `Bearer ${token}` };
};

// get all users
export const fetchAllUsers = async (): Promise<UserType[]> => {
    try {
        const response = await axios.get(`${serVer}/admin/users`, {
            headers: getAdminAuthHeader(),
        });
        return response.data.users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// get admin dashboard data
export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
    try {
        const response = await axios.get(`${serVer}/admin/dashboard`, {
            headers: getAdminAuthHeader(),
        });
        return {
            stats: response.data.stats,
            charts: response.data.charts,
        };
    } catch (error) {
        console.error("Error fetching admin dashboard:", error);
        throw error;
    }
};

// get journalist dashboard data
export const fetchUserDashboard = async (): Promise<UserDashboardData> => {
    try {
        const response = await axios.get(`${serVer}/user/dashboard`, {
            headers: getUserAuthHeader(),
        });
        return {
            stats: response.data.stats,
            charts: response.data.charts,
        };
    } catch (error) {
        console.error("Error fetching user dashboard:", error);
        throw error;
    }
};

// get single user with submitted news
export const fetchUserDetails = async (
    userId: string,
): Promise<{ user: UserType; unpublishedNews: UnpublishedNewsType[] }> => {
    try {
        const response = await axios.get(`${serVer}/admin/users/${userId}`, {
            headers: getAdminAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
};

// create user
export const createUser = async (
    data: UserPayload,
): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${serVer}/admin/users`, data, {
            headers: getAdminAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// update user
export const updateUser = async (
    userId: string,
    data: UserPayload,
): Promise<{ message: string; user: UserType }> => {
    try {
        const response = await axios.put(
            `${serVer}/admin/users/${userId}`,
            data,
            {
                headers: getAdminAuthHeader(),
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// delete user
export const deleteUser = async (
    userId: string,
): Promise<{ message: string }> => {
    try {
        const response = await axios.delete(`${serVer}/admin/users/${userId}`, {
            headers: getAdminAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

// update journalist profile
export const updateMyProfile = async (
    data: Pick<UserPayload, "name" | "email">,
): Promise<{ message: string; user: UserType }> => {
    try {
        const response = await axios.put(`${serVer}/user/me`, data, {
            headers: getUserAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

// update journalist KYC
export const updateMyKyc = async (
    data: KycPayload,
): Promise<{ message: string; user: UserType }> => {
    try {
        const response = await axios.put(`${serVer}/user/kyc`, data, {
            headers: getUserAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error updating KYC:", error);
        throw error;
    }
};

// change journalist password
export const changeMyPassword = async (data: {
    currentPassword: string;
    newPassword: string;
}): Promise<{ message: string }> => {
    try {
        const response = await axios.patch(`${serVer}/user/password`, data, {
            headers: getUserAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

export const changeAdminPassword = async (data: {
    currentPassword: string;
    newPassword: string;
}): Promise<{ message: string }> => {
    try {
        const response = await axios.patch(`${serVer}/admin/password`, data, {
            headers: getAdminAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error changing admin password:", error);
        throw error;
    }
};

// fetch journalist submitted news
export const fetchMyUnpublishedNews = async (): Promise<
    UnpublishedNewsType[]
> => {
    try {
        const response = await axios.get(`${serVer}/user/news`, {
            headers: getUserAuthHeader(),
        });
        return response.data.news;
    } catch (error) {
        console.error("Error fetching submitted news:", error);
        throw error;
    }
};

// submit journalist news for admin review
export const createUnpublishedNews = async (
    data: NewsPayload,
): Promise<{ message: string; news: UnpublishedNewsType }> => {
    try {
        const response = await axios.post(`${serVer}/user/news`, data, {
            headers: getUserAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting news:", error);
        throw error;
    }
};

export const fetchMyNotifications = async (
    category?: string,
    scope: "admin" | "user" = "user",
): Promise<NotificationsResponse> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const response = await axios.get(`${serVer}/notifications${query}`, {
        headers: scope === "admin" ? getAdminAuthHeader() : getUserAuthHeader(),
    });
    return {
        notifications: response.data.notifications || [],
        unreadCount: response.data.unreadCount || 0,
    };
};

export const markNotificationRead = async (
    notificationId: string,
    scope: "admin" | "user" = "user",
): Promise<void> => {
    await axios.patch(
        `${serVer}/notifications/${notificationId}/read`,
        {},
        {
            headers: scope === "admin" ? getAdminAuthHeader() : getUserAuthHeader(),
        },
    );
};

export const markAllNotificationsRead = async (
    scope: "admin" | "user" = "user",
): Promise<void> => {
    await axios.patch(
        `${serVer}/notifications/read-all`,
        {},
        {
            headers: scope === "admin" ? getAdminAuthHeader() : getUserAuthHeader(),
        },
    );
};

export const fetchAdminPersonalities = async (): Promise<PersonalityType[]> => {
    const response = await axios.get(`${serVer}/admin/personalities`, {
        headers: getAdminAuthHeader(),
    });
    return response.data.personalities;
};

export const createPersonality = async (payload: {
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
}): Promise<{ message: string }> => {
    const response = await axios.post(`${serVer}/admin/personalities`, payload, {
        headers: getAdminAuthHeader(),
    });
    return response.data;
};

export const updatePersonality = async (
    personalityId: string,
    payload: {
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
    },
): Promise<{ message: string }> => {
    const response = await axios.put(
        `${serVer}/admin/personalities/${personalityId}`,
        payload,
        {
            headers: getAdminAuthHeader(),
        },
    );
    return response.data;
};

export const deletePersonality = async (
    personalityId: string,
): Promise<{ message: string }> => {
    const response = await axios.delete(
        `${serVer}/admin/personalities/${personalityId}`,
        {
            headers: getAdminAuthHeader(),
        },
    );
    return response.data;
};

export const fetchAdminSettings = async (): Promise<AppSettingsType> => {
    const response = await axios.get(`${serVer}/admin/settings`, {
        headers: getAdminAuthHeader(),
    });
    return response.data.settings;
};

export const updateAdminSettings = async (
    payload: Partial<AppSettingsType>,
): Promise<{ message: string; settings: AppSettingsType }> => {
    const response = await axios.put(`${serVer}/admin/settings`, payload, {
        headers: getAdminAuthHeader(),
    });
    return response.data;
};

// admin updates submitted news
export const updateUnpublishedNews = async (
    newsId: string,
    data: NewsPayload,
): Promise<{ message: string; news: UnpublishedNewsType }> => {
    try {
        const response = await axios.put(
            `${serVer}/admin/unpublished-news/${newsId}`,
            data,
            { headers: getAdminAuthHeader() },
        );
        return response.data;
    } catch (error) {
        console.error("Error updating submitted news:", error);
        throw error;
    }
};

// admin publishes submitted news
export const publishUnpublishedNews = async (
    newsId: string,
): Promise<{ message: string }> => {
    try {
        const response = await axios.post(
            `${serVer}/admin/unpublished-news/${newsId}/publish`,
            {},
            { headers: getAdminAuthHeader() },
        );
        return response.data;
    } catch (error) {
        console.error("Error publishing submitted news:", error);
        throw error;
    }
};

export const deleteUnpublishedNews = async (
    newsId: string,
): Promise<{ message: string }> => {
    try {
        const response = await axios.delete(
            `${serVer}/admin/unpublished-news/${newsId}`,
            { headers: getAdminAuthHeader() },
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting submitted news:", error);
        throw error;
    }
};
