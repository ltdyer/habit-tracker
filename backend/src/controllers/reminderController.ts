import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Reminders } from "../models/reminder";
import logging from "../config/logging";

export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminders = await Reminders.find();
    console.log("Reminders retrieved:", reminders);
    logging.log("AHHHHH", reminders)
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
    const reminderToInsert = req.body
    const addedReminder = await Reminders.create(reminderToInsert)
    res.status(200).json({
      _id: addedReminder._id,
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
    // get id from the query params
    const idToDelete = req.params['id'];
    console.log(idToDelete)
    // find correct reminder and delete it
    await Reminders.deleteOne({_id: new ObjectId(idToDelete)})

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
    // request will contain new reminder: it will have same id as something in the db just the value
    // will be changed. SO we need to get the existing reminder and update it
    console.log(req.body)
    const objectId = new ObjectId(req.body._id as string)
    const updatedDocument = await Reminders.findOneAndUpdate({_id: objectId}, {$set: {value: req.body.value}}, {
      new: true
    });
    res.status(200).json(updatedDocument)
  } catch (error) {
    console.error("Failed to update reminder:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update reminder"
    });
  }
}
