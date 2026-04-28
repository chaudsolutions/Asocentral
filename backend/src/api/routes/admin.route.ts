import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { adminController } from "../../controllers/admin.controller";

const adminRoute = Router();

adminRoute.use(authenticate);

// admin data
adminRoute.get("/me", adminController.getAdminData);

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

export default adminRoute;
