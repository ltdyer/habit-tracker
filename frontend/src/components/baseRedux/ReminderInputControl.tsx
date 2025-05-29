import { useState, KeyboardEvent } from "react";
import { Reminder } from "../../interfaces/RemindersInterfaces";
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectReminders, addReminder } from '../../app/remindersSlice';
import { TextField } from '@mui/material'
import "../../styling/ReminderDisplay.css"


export const ReminderInputControl = () => {

  const [inputValue, setInputValue] = useState<Reminder["value"]>("");
  const reminders = useAppSelector(selectReminders)
  const dispatch = useAppDispatch();


  const setReminder = async () => {
    if (reminders.map(reminder => reminder.value).includes(inputValue)) {
      console.log("reminder already in list!");
      // TODO: replace with some sort of error banner
    } else if (inputValue === "") {
      console.log("cannot add empty reminder");
    } else {
      await dispatch(addReminder({value: inputValue}))
    }
    // clear current input field 
    setInputValue("");
  }

  const setReminderOnEnter = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      setReminder()
    }
  }

  return (
    <div className="input-container">
      <TextField onKeyDown={(event) => setReminderOnEnter(event)} placeholder="enter reminder" 
          onChange={(event) => setInputValue(event.target.value)} value={inputValue} />
      <button onClick={() => setReminder()}>
        Click to add reminder
      </button>
    </div>
    
  )
}