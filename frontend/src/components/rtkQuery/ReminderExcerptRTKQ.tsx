import { Reminder } from "../../interfaces/RemindersInterfaces"
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useState, KeyboardEvent, MouseEvent, useEffect, ReactNode } from "react";
import { ListItemButton, ListItem, ListItemIcon, ListItemText, TextField, ClickAwayListener, CircularProgress } from "@mui/material";
import { CircleOutlined, DehazeRounded } from "@mui/icons-material";
import { Draggable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { useDeleteReminderMutation, useEditReminderMutation } from "../../app/remindersSliceRTKQ";

interface ReminderProps {
  reminder: Reminder
  index: number
}

export const ReminderExcerptRTKQ = ({ reminder, index }: ReminderProps) => {


  const [deleteReminder, { isLoading }] = useDeleteReminderMutation();
  const [editReminder] = useEditReminderMutation();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [newReminderValue, setNewReminderValue] = useState<string>(reminder.value)

  const removeReminder = async (reminderToDelete: Reminder) => {
    await deleteReminder(reminderToDelete._id);
  }

  const changeReminder = async (event: KeyboardEvent) => {
    // when we click on the ListItemtext button, we want to be able to input new text

    if (event.key.toLowerCase() === 'enter') {
      await editReminder({...reminder, value: newReminderValue});
      setEditMode(false);
    }
  }

  let deletePending: ReactNode
  if (isLoading) {
    deletePending = (
      <CircularProgress />
    )
  }

  // if reminders have been rearranged, need to update the placeholder value so it matches the reminder in the new position     
  useEffect(() => {
    setNewReminderValue(reminder.value)
  }, [reminder])

  return (
    <Draggable index={index} draggableId={index.toString()}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {provided.dragHandleProps && 
            <ListItem sx={{backgroundColor: 'lightyellow', borderRadius: "25px"}}>
              <ListItemIcon >
                <ListItemButton onClick={() => removeReminder(reminder)}>
                  <CircleOutlined />
                </ListItemButton>
              </ListItemIcon>
              <ListItemText>
                <ClickAwayListener onClickAway={() => setEditMode(false)}>
                  {editMode === false ? 
                  <ListItemButton onClick={() => setEditMode(true)}>
                    {reminder.value}
                  </ListItemButton> : 
                  <TextField onChange={(event) => setNewReminderValue(event.target.value)}
                        value={newReminderValue}
                        onKeyDown={(event) => changeReminder(event)}>
                  </TextField>}
                </ClickAwayListener>
              </ListItemText>
              <ListItemIcon>
                <ListItemButton {...provided.dragHandleProps}>
                  <DehazeRounded />
                  {deletePending}
                </ListItemButton>
              </ListItemIcon>
            </ListItem>
          }
        </div>
      )}
    </Draggable>
    
  )
}