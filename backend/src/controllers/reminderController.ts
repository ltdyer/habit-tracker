import { Request, Response } from "express";
import { getDb } from "../database/db";
import { Collection, Document } from "mongodb";

export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const collection: Collection<Document> = db.collection("reminders");

    const reminders = await collection.find().toArray();

    console.log("Reminders retrieved:", reminders);

    // res.status(200).json(reminders);
    res.status(200).json([{id: 1, value: "initial reminder"}]);
  } catch (error) {
    console.error("Failed to fetch reminders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve reminders"
    });
  }
};
