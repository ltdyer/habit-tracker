import { Router } from "express";
import { getReminders, addReminder, deleteReminder, editReminder } from "../controllers/reminderController";

const router: Router = Router();

// Route: GET /reminders/getAll
router.get("/getAll", getReminders);

// Route: POST /reminders/addReminder
router.post("/addReminder", addReminder);

// Route: DELETE /reminder/:id
router.post("/deleteReminder/:id", deleteReminder);

// Route: POST /reminders/edit
router.post("/editReminder", editReminder);

export default router;
