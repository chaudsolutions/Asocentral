import axios from "axios";
import { serVer } from "~/utils/constants";
import { getUserToken } from "./useTools";
import type { UserType } from "~/types/user";

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
