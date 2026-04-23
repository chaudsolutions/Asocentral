import axios from "axios";
import { serVer } from "~/utils/constants";
import { getUserToken } from "./useTools";
import type { UserType } from "~/types/user";

type LoginPayload = {
    email: string;
    password: string;
};

// login for admin
export const adminLogin = async (
    data: LoginPayload,
): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`${serVer}/auth/admin/login`, data);

        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// get admin data
export const getAdminData = async (): Promise<UserType> => {
    const { token } = getUserToken();
    try {
        const response = await axios.get(`${serVer}/admin/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.admin;
    } catch (error) {
        console.error("Error fetching admin data:", error);
        throw error;
    }
};

// login for user
export const userLogin = async (
    data: LoginPayload,
): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`${serVer}/auth/user/login`, data);

        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// get user data
export const getUserData = async (): Promise<UserType> => {
    const { token } = getUserToken();
    try {
        const response = await axios.get(`${serVer}/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
