import { Router } from "express";
import { getBirds } from "../controllers/birdController";

const router: Router = Router();

// Route: GET /birds
router.get("/birds", getBirds);

export default router;
