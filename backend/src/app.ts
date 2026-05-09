import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";

import type MessageResponse from "./interfaces/message-response.js";

import api from "./api/index.js";
import * as middlewares from "./middlewares.js";
import connectDB from "./utils/connectDb.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
    cors({
        origin: "*", // Allow only this origin
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Allowed methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
        optionsSuccessStatus: 204,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get<object, MessageResponse>("/", (req, res) => {
    res.json({
        message: "Welcome to N/A API",
    });
});

connectDB();

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
