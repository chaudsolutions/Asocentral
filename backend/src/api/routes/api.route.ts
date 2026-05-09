import { Router } from "express";
import { apiController } from "../../controllers/api.controller";
import { personalityController } from "../../controllers/personality.controller";
import { staticController } from "../../controllers/static.controller";
import { appSettingsController } from "../../controllers/app-settings.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const apiRoute = Router();

apiRoute.get("/news", apiController.getNewsFromNewsDataIo);

apiRoute.get("/news/:articleId", apiController.getSingleNews);

apiRoute.patch("/news/:newsId/metrics", apiController.updateNewsMetrics);

apiRoute.post("/news/:newsId/comments", apiController.addNewsComment);
apiRoute.delete(
    "/news/:newsId/comments/:commentId",
    authenticate,
    apiController.deleteNewsComment,
);

apiRoute.get("/categories", apiController.getCategories);
apiRoute.get("/personalities", personalityController.getPersonalities);
apiRoute.get(
    "/personalities/:personalityId",
    personalityController.getSinglePersonality,
);
apiRoute.post("/contact", staticController.contactUs);
apiRoute.get("/settings", appSettingsController.getPublicSettings);

export default apiRoute;
