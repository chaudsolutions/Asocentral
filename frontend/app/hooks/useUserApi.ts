import axios from "axios";
import { serVer } from "~/utils/constants";
import { getUserToken } from "./useTools";
import type { UserRole, UserType } from "~/types/user";
import type { NewsPayload } from "./useNewsDataApi";
import type { UnpublishedNewsType } from "~/types/news";

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
    idCardImage?: string;
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

// get all users
export const fetchAllUsers = async (): Promise<UserType[]> => {
    const { token } = getUserToken();
    try {
        const response = await axios.get(`${serVer}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// get admin dashboard data
export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
    const { token } = getUserToken();
    try {
        const response = await axios.get(`${serVer}/admin/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    const { token } = getUserToken();
    try {
        const response = await axios.get(`${serVer}/user/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    const { token } = getUserToken();
    try {
        const response = await axios.get(`${serVer}/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    const { token } = getUserToken();
    try {
        const response = await axios.post(`${serVer}/admin/users`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    const { token } = getUserToken();
    try {
        const response = await axios.put(
            `${serVer}/admin/users/${userId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
    const { token } = getUserToken();
    try {
        const response = await axios.delete(`${serVer}/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
    const { token } = getUserToken();
    try {
        const response = await axios.put(`${serVer}/user/me`, data, {
            headers: { Authorization: `Bearer ${token}` },
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
    const { token } = getUserToken();
    try {
        const response = await axios.put(`${serVer}/user/kyc`, data, {
            headers: { Authorization: `Bearer ${token}` },
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
    const { token } = getUserToken();
    try {
        const response = await axios.patch(`${serVer}/user/password`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

// fetch journalist submitted news
export const fetchMyUnpublishedNews = async (): Promise<
    UnpublishedNewsType[]
> => {
    const { token } = getUserToken();
    try {
        const response = await axios.get(`${serVer}/user/news`, {
            headers: { Authorization: `Bearer ${token}` },
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
    const { token } = getUserToken();
    try {
        const response = await axios.post(`${serVer}/user/news`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting news:", error);
        throw error;
    }
};

// admin updates submitted news
export const updateUnpublishedNews = async (
    newsId: string,
    data: NewsPayload,
): Promise<{ message: string; news: UnpublishedNewsType }> => {
    const { token } = getUserToken();
    try {
        const response = await axios.put(
            `${serVer}/admin/unpublished-news/${newsId}`,
            data,
            { headers: { Authorization: `Bearer ${token}` } },
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
    const { token } = getUserToken();
    try {
        const response = await axios.post(
            `${serVer}/admin/unpublished-news/${newsId}/publish`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
    } catch (error) {
        console.error("Error publishing submitted news:", error);
        throw error;
    }
};
