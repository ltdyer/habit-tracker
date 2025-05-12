import { Schema, model } from "mongoose";

const reminderSchema = new Schema({
  value: String
}, {
  versionKey: false
})

export const Reminders = model('Reminders', reminderSchema)