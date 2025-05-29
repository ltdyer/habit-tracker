import {  useEffect, ReactNode } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Stack, Alert } from '@mui/material'
import { ReminderInputControlRTKQ } from '../rtkQuery/ReminderInputControlRTKQ';
import { DroppableCanvasRTKQ } from '../rtkQuery/DroppableCanvasRTKQ';
import { useFetchRemindersQuery } from '../../app/remindersSliceRTKQ';

export const ReminderDisplayRTKQ = () => {
  
  /**
   * Created separate component to show the differences between using RTK Query and base Redux when making Async API calls
   * One large change is that we no longer need to worry about using a useEffect and making sure to dispatch a thunk on page load
   * The query does it automatically.
   * Additionally, we don't need to use useSelector to check for status and error - that info is included in the hook
   * Since I'm still dispatching stuff into the store in a very impractical way (its the principle)
   * I actually still need to dispatch the results on successful fetch
   */

  const {
    isError,
    isLoading,
    error
  } = useFetchRemindersQuery()
  


  useEffect(() => {
    console.log(import.meta.env)
  }, [import.meta.env])




  // interesting way to set dynamic content up without putting it in a function or doing inline rendereing in JSX return
  // both this approach and the inline approach in ReminderExcerpt are valid
  // this is more useful for complex rendering with loops and nesting

  let errorContent: ReactNode;
  let pendingContent: ReactNode;
  // show spinner if status is idle
  if (isLoading) {
    pendingContent = <CircularProgress />
  }
  else if (isError) {
    errorContent = 
        <Alert severity={"error"}>{error.toString()}</Alert>
  }

  return (
    <Box>
      {errorContent}
      <h1>Reminders howdy</h1>
      <h2>{import.meta.env.MODE}</h2>
      <h2>{`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_FRONTEND_PORT}`}</h2>
      

      <Stack spacing={3}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <ReminderInputControlRTKQ />
        </Box>

        <Box sx={{backgroundColor: "lightblue", padding: "1em", borderRadius: '5px'}}>
          <DroppableCanvasRTKQ />
        </Box>
      </Stack>
      

      {pendingContent}

    </Box>
  )
}

