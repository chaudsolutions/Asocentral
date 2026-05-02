import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from "@react-router/dev/routes";

export default [
    // main layout
    layout("layout/MainLayout.tsx", [
        // static pages
        index("routes/public/home.tsx"),

        // dynamic pages
        route("category/:categoryName", "routes/public/category.tsx", {
            id: "news-category", // Explicit unique ID
        }),
        route("news/:articleId", "routes/public/single-news.tsx", {
            id: "single-news", // Explicit unique ID
        }),

        // 404 page for unmatched routes
        route("*", "routes/public/404.tsx"),
    ]),

    // admin authentication layout
    layout("layout/AdminAuthLayout.tsx", [
        route("auth/admin", "routes/auth/admin-auth.tsx"),
    ]),

    // journalist authentication layout
    layout("layout/UserAuthLayout.tsx", [
        route("auth/user", "routes/auth/user-auth.tsx"),
    ]),

    // admin layout and protected pages
    layout("layout/AdminLayout.tsx", [
        ...prefix("admin", [
            route("dashboard", "routes/admin/admin-dashboard.tsx"),
            route("users", "routes/admin/admin-users.tsx"),
            route("category", "routes/admin/admin-category.tsx"),
            route("news", "routes/admin/admin-news.tsx"),
            // admin 404 page for unmatched admin routes
            route("*", "routes/admin/admin404.tsx"),
        ]),
    ]),

    // journalist layout and protected pages
    layout("layout/UserLayout.tsx", [
        ...prefix("user", [
            route("dashboard", "routes/user/user-dashboard.tsx"),
            route("news", "routes/user/user-news.tsx"),
            route("settings", "routes/user/user-settings.tsx"),
        ]),
    ]),
] satisfies RouteConfig;
