import { useState, useEffect, KeyboardEvent, ReactNode } from 'react'
import { Reminder } from '../interfaces/RemindersInterfaces';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectReminders, errorMessage, fetchReminders, remindersStatus } from '../app/remindersSlice';
import { ReminderExcerpt } from './ReminderExcerpt';
import CircularProgress from '@mui/material/CircularProgress'
import {Box, Divider, Stack, Alert} from '@mui/material'
import { ReminderInputControl } from './ReminderInputControl';

export const ReminderDisplay = () => {
  const dispatch = useAppDispatch();
  const reminders = useAppSelector(selectReminders)
  const status = useAppSelector(remindersStatus)
  const error = useAppSelector(errorMessage);

  useEffect(() => {
    console.log(import.meta.env)
  }, [import.meta.env])

  // calls getAllReminders on page load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReminders())
    }
  }, [dispatch, remindersStatus])



  // interesting way to set dynamic content up without putting it in a function or doing inline rendereing in JSX return
  // both this approach and the inline approach in ReminderExcerpt are valid
  // this is more useful for complex rendering with loops and nesting
  let content: ReactNode = 
      <Stack spacing={1} divider={<Divider orientation='horizontal' flexItem />} >
       { reminders.map((reminder: Reminder) => {
          return (
            <ReminderExcerpt key={reminder.value} reminder={reminder} />
          )
        })}
      </Stack>
  let errorContent: ReactNode;
  let pendingContent: ReactNode;
  // show spinner if status is idle
  if (status === "pending") {
    pendingContent = <CircularProgress />
  }
  else if (status === "failed") {
    errorContent = 
        <Alert severity={"error"}>{error}</Alert>
  }


  return (
    <Box>
      {errorContent}
      <h1>Reminders howdy</h1>
      <h2>{import.meta.env.MODE}</h2>
      <h2>{`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_FRONTEND_PORT}`}</h2>
      
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        <ReminderInputControl />
      </Box>
      <Box sx={{backgroundColor: "lightblue", padding: "1em"}}>
        {content}
      </Box>
      {pendingContent}

    </Box>
  )
}

