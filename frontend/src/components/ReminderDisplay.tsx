import { useState, useEffect, KeyboardEvent, ReactNode } from 'react'
import { Reminder } from '../interfaces/RemindersInterfaces';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectReminders, addReminder, fetchReminders, remindersStatus } from '../app/remindersSlice';
import { ReminderExcerpt } from './ReminderExcerpt';
import CircularProgress from '@mui/material/CircularProgress'
import {Box, List} from '@mui/material'
import "../styling/ReminderDisplay.css"

export const ReminderDisplay = () => {
  const [inputValue, setInputValue] = useState<Reminder["value"]>("");
  const dispatch = useAppDispatch();
  const reminders = useAppSelector(selectReminders)
  const status = useAppSelector(remindersStatus)

  useEffect(() => {
    console.log(import.meta.env)
  }, [import.meta.env])

  // calls getAllReminders on page load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReminders())
    }
  }, [dispatch, remindersStatus])

  const setReminder = () => {
    if (reminders.map(reminder => reminder.value).includes(inputValue)) {
      console.log("reminder already in list!");
      // TODO: replace with some sort of error banner
    } else if (inputValue === "") {
      console.log("cannot add empty reminder");
    } else {
      // get current last id
      const latestId = reminders[reminders.length-1].id
      dispatch(addReminder({value: inputValue, id: latestId+1}))
    }
    // clear current input field 
    setInputValue("");
  }

  const setReminderOnEnter = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      setReminder()
    }
  }

  // interesting way to set dynamic content up without putting it in a function or doing inline rendereing in JSX return
  // both this approach and the inline approach in ReminderExcerpt are valid
  // this is more useful for complex rendering with loops and nesting
  let content: ReactNode;
  // show spinner if status is idle
  if (status === "pending") {
    content = <CircularProgress />
  }
  // show reminders if status is idle or suceeded 
  else if (status === "idle" || status === "succeeded") {
    content = 
      <List>
       { reminders.map((reminder: Reminder) => {
          return (
            <ReminderExcerpt key={reminder.value} reminder={reminder} />
          )
        })}
      </List>
  }


  return (
    <Box sx={{ bgcolor: 'lightblue'}}>
      <h1>Reminders howdy</h1>
      <h2>{import.meta.env.MODE}</h2>
      <h2>{`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_FRONTEND_PORT}`}</h2>
      <div className="input-container">
        <input onKeyDown={(event) => setReminderOnEnter(event)} placeholder="enter reminder" 
          onChange={(event) => setInputValue(event.target.value)} value={inputValue} />
        <button onClick={() => setReminder()}>
          Click to add reminder
        </button>
      </div>
      {content}
    </Box>
  )
}

