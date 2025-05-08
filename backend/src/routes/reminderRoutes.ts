import { Router } from "express";
import { getReminders, addReminder } from "../controllers/reminderController";

const router: Router = Router();

// Route: GET /reminders/getAll
router.get("/getAll", getReminders);

// Route: POST /remindners/addReminder
router.post("/addReminder", addReminder);

export default router;
