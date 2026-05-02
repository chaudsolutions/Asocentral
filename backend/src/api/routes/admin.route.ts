import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { adminController } from "../../controllers/admin.controller";

const adminRoute = Router();

adminRoute.use(authenticate);

// admin data
adminRoute.get("/me", adminController.getAdminData);
adminRoute.get("/dashboard", adminController.getDashboardData);

// category
adminRoute.post("/category", adminController.createCategory);
adminRoute.put("/category/:categoryId", adminController.updateCategory);
adminRoute.delete("/category/:categoryId", adminController.deleteCategory);

// news
adminRoute.post("/news", adminController.createNews);
adminRoute.put("/news/:newsId", adminController.updateNews);
adminRoute.delete("/news/:newsId", adminController.deleteNews);

// news status
adminRoute.patch("/news/:newsId/status", adminController.updateNewsStatus);

// users
adminRoute.get("/users", adminController.getAllUsers);
adminRoute.post("/users", adminController.createUser);
adminRoute.get("/users/:userId", adminController.getUserDetails);
adminRoute.put("/users/:userId", adminController.updateUser);
adminRoute.delete("/users/:userId", adminController.deleteUser);

// submitted journalist news
adminRoute.put("/unpublished-news/:newsId", adminController.updateUnpublishedNews);
adminRoute.post(
    "/unpublished-news/:newsId/publish",
    adminController.publishUnpublishedNews,
);

export default adminRoute;
