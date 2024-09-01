import express, { Application } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import limiter from "./config/rateLimiter.js";
import ErrorMiddleware from "./middlewares/error.js";

import user from "./routes/userRoute.js";
import blog from "./routes/blogRoute.js";
import admin from "./routes/adminRoute.js";
import comment from "./routes/commentRoute.js";
import like from "./routes/likeRoute.js";

const app: Application = express();

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
        ];

        if (!origin || allowedOrigins.includes(origin as string)) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use("/api/v1/user", user);
app.use("/api/v1/blog", blog);
app.use("/api/v1/admin", admin);
app.use("/api/v1/comment", comment);
app.use("/api/v1/like", like);

app.use(ErrorMiddleware);

export default app;