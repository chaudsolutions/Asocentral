import { Router } from "express";
import { validateLogin } from "../../middlewares/validation.middleware";
import { authRateLimiter } from "../../middlewares/rate-limit.middleware";
import { authController } from "../../controllers/auth.controller";

const authRoute = Router();

// Apply rate limiting specifically to auth routes
authRoute.use(authRateLimiter);

authRoute.post("/user/login", validateLogin, authController.userLogin);

authRoute.post("/admin/login", validateLogin, authController.adminLogin);

export default authRoute;
