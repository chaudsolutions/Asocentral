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
    ]),

    // admin authentication layout
    layout("layout/AdminAuthLayout.tsx", [
        route("auth/admin", "routes/auth/admin-auth.tsx"),
    ]),

    // admin layout and protected pages
    layout("layout/AdminLayout.tsx", [
        ...prefix("admin", [
            route("dashboard", "routes/admin/admin-dashboard.tsx"),
            route("category", "routes/admin/admin-category.tsx"),
            route("news", "routes/admin/admin-news.tsx"),
        ]),
        // admin 404 page for unmatched admin routes
        route("*", "routes/admin/admin404.tsx"),
    ]),
] satisfies RouteConfig;
