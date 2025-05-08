import { Request, Response } from "express";
import { getDb } from "../database/db";
import { Collection, Document, InsertOneResult } from "mongodb";

export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const collection: Collection = db.collection("reminders");
    console.log(collection.collectionName)
    const numDocs = await collection.estimatedDocumentCount()
    console.log(numDocs)
    const reminders = await collection.find().toArray()

    console.log("Reminders retrieved:", reminders);

    // res.status(200).json(reminders);
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Failed to fetch reminders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve reminders"
    });
  }
};

export const addReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const collection: Collection = db.collection("reminders");
    console.log(req.body)
    const reminderToInsert = req.body
    const addedReminder: InsertOneResult<Document> = await collection.insertOne(reminderToInsert)
    res.status(200).json({
      _id: addedReminder.insertedId,
      value: reminderToInsert.value
    })

  } catch (error) {
    console.error("Failed to add reminder:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to add reminder"
    });
  }
}
