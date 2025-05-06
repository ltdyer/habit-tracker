import { Router } from "express";
import { getReminders } from "../controllers/reminderController";

const router: Router = Router();

// Route: GET /reminders/getAll
router.get("/getAll", getReminders);

export default router;
