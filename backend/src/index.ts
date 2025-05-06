import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import birdRoutes from "./routes/birdRoutes";
import reminderRoutes from "./routes/reminderRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { connectToMongo } from "./database/db";

const app: Application = express();

// Optional: ensure env vars are typed
const port = process.env.BACKEND_PORT || 3000;
const host = process.env.HOST || "localhost";

console.log(process.env);

// CORS: allow all for private app
app.use(cors());

// Register routes
app.use("/birds", birdRoutes);
app.use("/reminders", reminderRoutes);

// Error handling middleware (must come after routes)
app.use(errorHandler);

// Connect to MongoDB and start server
connectToMongo().then(() => {
  app.listen(Number(port), () => {
    console.log(`✅ Backend listening on http://${host}:${port}`);
  });
});

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("howdy");
});
