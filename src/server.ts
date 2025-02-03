import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./configs/db";
import routes from "./routes/index";
import errorHandler from "./middleware/error.middleware";
import { initSocket } from "./socket";

dotenv.config();

const app = express();
const server = http.createServer(app);

const origins = process.env.CORS_ORIGINS?.split(",") || [];

const corsOptions = {
  origin: process.env.NODE_ENV === "prod" ? origins : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", routes);
initSocket(server);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
