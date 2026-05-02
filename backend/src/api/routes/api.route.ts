import { Router } from "express";
import { apiController } from "../../controllers/api.controller";

const apiRoute = Router();

apiRoute.get("/news", apiController.getNewsFromNewsDataIo);

apiRoute.get("/news/:articleId", apiController.getSingleNews);

apiRoute.patch("/news/:newsId/metrics", apiController.updateNewsMetrics);

apiRoute.post("/news/:newsId/comments", apiController.addNewsComment);

apiRoute.get("/categories", apiController.getCategories);

export default apiRoute;
