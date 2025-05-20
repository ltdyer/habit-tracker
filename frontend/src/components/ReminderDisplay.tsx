import {  useEffect, ReactNode, useState } from 'react'
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { errorMessage, fetchReminders, remindersStatus } from '../app/remindersSlice';
import CircularProgress from '@mui/material/CircularProgress'
import {Box, Snackbar, Stack, Alert, Grow} from '@mui/material'
import { ReminderInputControl } from './ReminderInputControl';
import { DroppableCanvas } from './DroppableCanvas';

export const ReminderDisplay = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(remindersStatus)
  const error = useAppSelector(errorMessage);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)

  useEffect(() => {
    console.log(import.meta.env)
  }, [import.meta.env])

  // calls getAllReminders on page load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReminders())
    }
  }, [dispatch, remindersStatus])

  useEffect(() => {
    if (status === "succeeded") {
      setOpenSnackbar(true)
    }
  }, [status])



  // interesting way to set dynamic content up without putting it in a function or doing inline rendereing in JSX return
  // both this approach and the inline approach in ReminderExcerpt are valid
  // this is more useful for complex rendering with loops and nesting

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
      
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={"Reminder added"}
        autoHideDuration={2000}
        slots={{
          transition: Grow
        }}
        onClose={() => setOpenSnackbar(false)}
      />

      <Stack spacing={3}>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <ReminderInputControl />
        </Box>

        <Box sx={{backgroundColor: "lightblue", padding: "1em", borderRadius: '5px'}}>
          <DroppableCanvas />
        </Box>
      </Stack>
      

      {pendingContent}

    </Box>
  )
}

