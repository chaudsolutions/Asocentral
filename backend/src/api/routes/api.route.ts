import { Router } from "express";
import { apiController } from "../../controllers/api.controller";

const apiRoute = Router();

apiRoute.get("/news", apiController.getNewsFromNewsDataIo);

apiRoute.get("/news/:articleId", apiController.getSingleNews);

apiRoute.get("/categories", apiController.getCategories);

export default apiRoute;
