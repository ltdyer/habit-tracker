import { Request, Response } from "express";
import { getDb } from "../database/db";
import { Collection, Document, InsertOneResult, ObjectId } from "mongodb";

export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const collection: Collection = db.collection("reminders");

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

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    // get db and reminders collecxtion
    const db = getDb();
    const collection: Collection = db.collection("reminders");

    // get id from the query params
    const idToDelete = req.params['id'];
    console.log(idToDelete)
    // find correct reminder and delete it
    await collection.deleteOne({_id: new ObjectId(idToDelete)})

    // return deleted reminder so we can remove from frontend
    res.status(200).json({
      _id: idToDelete
    })

  } catch (error) {
    console.error("Failed to delete reminder:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete reminder"
    });
  }
}

export const editReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const collection = db.collection("reminders");
  
    // request will contain new reminder: it will have same id as something in the db just the value
    // will be changed. SO we need to get the existing reminder and update it
    console.log(req.body)
    const objectId = new ObjectId(req.body._id as string)
    await collection.updateOne({_id: objectId}, {$set: {value: req.body.value}});
    res.status(200).json(req.body)
  } catch (error) {
    console.error("Failed to update reminder:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update reminder"
    });
  }
  

}
