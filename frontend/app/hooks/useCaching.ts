import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNewsCategories } from "./useNewsCategories";
import { fetchNewsData, fetchSingleNewsData } from "./useNewsDataApi";
import { getAdminData, getUserData } from "./useAuthApi";
import { useAuthContext } from "~/context/AuthContext";
import {
    fetchAdminDashboard,
    fetchAllUsers,
    fetchMyUnpublishedNews,
    fetchUserDashboard,
} from "./useUserApi";

// use query to clear cache for logout
export const useInvalidateCache = () => {
    const queryClient = useQueryClient(); // Get the query client

    return { queryClient };
};

// use news categories data
export const useNewsCategories = () => {
    const {
        data: newsCategories,
        isLoading: isNewsCategoriesLoading,
        error: newsCategoriesError,
        refetch: refetchNewsCategories,
    } = useQuery({
        queryKey: ["newsCategories"],
        queryFn: getNewsCategories,
    });

    return {
        newsCategories,
        isNewsCategoriesLoading,
        newsCategoriesError,
        refetchNewsCategories,
    };
};

// use news data
export const useNewsData = () => {
    const {
        data: newsData,
        isLoading: isNewsDataLoading,
        error: newsDataError,
        refetch: refetchNewsData,
    } = useQuery({
        queryKey: ["newsData"],
        queryFn: fetchNewsData,
    });

    return { newsData, isNewsDataLoading, newsDataError, refetchNewsData };
};

// use single news data
export const useSingleNewsData = (newsId: string) => {
    const {
        data: singleNewsData,
        isLoading: isSingleNewsDataLoading,
        error: singleNewsDataError,
        refetch: refetchSingleNewsData,
    } = useQuery({
        queryKey: ["singleNewsData", newsId],
        queryFn: () => fetchSingleNewsData(newsId),
        enabled: !!newsId, // Only run this query if newsId is provided
    });

    return {
        singleNewsData,
        isSingleNewsDataLoading,
        singleNewsDataError,
        refetchSingleNewsData,
    };
};

// use admin data
export const useAdminData = () => {
    const { user } = useAuthContext();
    const {
        data: adminData,
        isLoading: isAdminDataLoading,
        error: adminDataError,
        refetch: refetchAdminData,
    } = useQuery({
        queryKey: ["adminData"],
        queryFn: getAdminData,
        enabled: !!user,
    });

    return { adminData, isAdminDataLoading, adminDataError, refetchAdminData };
};

// use user data
export const useUserData = () => {
    const { user } = useAuthContext();
    const {
        data: userData,
        isLoading: isUserDataLoading,
        error: userDataError,
        refetch: refetchUserData,
    } = useQuery({
        queryKey: ["userData"],
        queryFn: getUserData,
        enabled: !!user,
    });

    return { userData, isUserDataLoading, userDataError, refetchUserData };
};

// use fetch all users data
export const useFetchAllUsers = () => {
    const {
        data: allUsers,
        isLoading: isAllUsersLoading,
        error: allUsersError,
        refetch: refetchAllUsers,
    } = useQuery({
        queryKey: ["allUsers"],
        queryFn: fetchAllUsers,
    });

    return { allUsers, isAllUsersLoading, allUsersError, refetchAllUsers };
};

// use admin dashboard data
export const useAdminDashboard = () => {
    const {
        data: adminDashboard,
        isLoading: isAdminDashboardLoading,
        error: adminDashboardError,
        refetch: refetchAdminDashboard,
    } = useQuery({
        queryKey: ["adminDashboard"],
        queryFn: fetchAdminDashboard,
    });

    return {
        adminDashboard,
        isAdminDashboardLoading,
        adminDashboardError,
        refetchAdminDashboard,
    };
};

// use journalist dashboard data
export const useUserDashboard = () => {
    const {
        data: userDashboard,
        isLoading: isUserDashboardLoading,
        error: userDashboardError,
        refetch: refetchUserDashboard,
    } = useQuery({
        queryKey: ["userDashboard"],
        queryFn: fetchUserDashboard,
    });

    return {
        userDashboard,
        isUserDashboardLoading,
        userDashboardError,
        refetchUserDashboard,
    };
};

// use fetch journalist submitted news
export const useMyUnpublishedNews = () => {
    const {
        data: myUnpublishedNews,
        isLoading: isMyUnpublishedNewsLoading,
        error: myUnpublishedNewsError,
        refetch: refetchMyUnpublishedNews,
    } = useQuery({
        queryKey: ["myUnpublishedNews"],
        queryFn: fetchMyUnpublishedNews,
    });

    return {
        myUnpublishedNews,
        isMyUnpublishedNewsLoading,
        myUnpublishedNewsError,
        refetchMyUnpublishedNews,
    };
};
