import { Reminder } from "../interfaces/RemindersInterfaces"
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useState, KeyboardEvent } from "react";
import { removeReminder, editReminder } from "../app/remindersSlice";
import { ListItemButton, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CircleOutlined, DehazeRounded } from "@mui/icons-material";

interface ReminderProps {
  reminder: Reminder
}

export const ReminderExcerpt = ({ reminder }: ReminderProps) => {

  const dispatch  = useAppDispatch();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [newReminderValue, setNewReminderValue] = useState<string>(reminder.value)

  const deleteReminder = (reminderToDelete: Reminder) => {
    dispatch(removeReminder(reminderToDelete));
  }

  const changeReminder = (event: KeyboardEvent) => {
    // when we click on the ListItemtext button, we want to be able to input new text

    if (event.key.toLowerCase() === 'enter') {
      dispatch(editReminder({...reminder, value: newReminderValue}));
      setEditMode(false);
    }
  }

  return (
    <ListItem>
      <ListItemIcon >
        <ListItemButton onClick={() => deleteReminder(reminder)}>
          <CircleOutlined />
        </ListItemButton>
      </ListItemIcon>
      <ListItemText>
        {editMode === false ? 
          <ListItemButton onClick={() => setEditMode(true)}>
            {reminder.value}
          </ListItemButton> : 
          <input onChange={(event) => setNewReminderValue(event.target.value)}
                 value={newReminderValue}
                 onKeyDown={(event) => changeReminder(event)}>
          </input>}
      </ListItemText>
      <ListItemIcon>
        <ListItemButton>
          <DehazeRounded />
        </ListItemButton>
      </ListItemIcon>
    </ListItem>
  )
}