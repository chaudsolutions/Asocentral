import express from "express";

import type MessageResponse from "../interfaces/message-response.js";
import apiRoute from "./routes/api.route.js";
import adminRoute from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏",
    });
});

router.use("/app", apiRoute);

router.use("/auth", authRoute);

router.use("/admin", adminRoute);

export default router;
