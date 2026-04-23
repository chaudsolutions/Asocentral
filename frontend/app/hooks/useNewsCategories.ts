import axios from "axios";
import type { NewsCategoryType } from "~/types/news";
import { serVer } from "~/utils/constants";
import { getUserToken } from "./useTools";

// get news categories
export const getNewsCategories = async (): Promise<NewsCategoryType[]> => {
    try {
        const response = await axios.get(`${serVer}/app/categories`);
        return response.data.categories;
    } catch (error) {
        console.error("Error fetching news categories:", error);
        throw error;
    }
};

type CreateCategoryPayload = {
    categoryName: string;
    categoryDescription: string;
    slug: string;
};

// create news category
export const createNewsCategory = async (
    data: CreateCategoryPayload,
): Promise<{ message: string }> => {
    const { token } = getUserToken();
    try {
        const response = await axios.post(`${serVer}/admin/category`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error creating news category:", error);
        throw error;
    }
};

// update news category
export const updateNewsCategory = async (
    categoryId: string,
    data: CreateCategoryPayload,
): Promise<{ message: string }> => {
    const { token } = getUserToken();
    try {
        const response = await axios.put(
            `${serVer}/admin/category/${categoryId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error("Error updating news category:", error);
        throw error;
    }
};

// delete news category
export const deleteNewsCategory = async (
    categoryId: string,
): Promise<{ message: string }> => {
    const { token } = getUserToken();
    try {
        const response = await axios.delete(
            `${serVer}/admin/category/${categoryId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error("Error deleting news category:", error);
        throw error;
    }
};
