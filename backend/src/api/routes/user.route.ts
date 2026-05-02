import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { userController } from "../../controllers/user.controller";

const userRoute = Router();

userRoute.use(authenticate);

userRoute.get("/me", userController.getUserData);
userRoute.get("/dashboard", userController.getDashboardData);
userRoute.put("/me", userController.updateUserData);
userRoute.put("/kyc", userController.updateKyc);
userRoute.patch("/password", userController.changePassword);

userRoute.get("/news", userController.getMyNews);
userRoute.post("/news", userController.createNews);

export default userRoute;
