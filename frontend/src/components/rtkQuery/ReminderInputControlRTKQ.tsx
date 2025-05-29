import { useState, KeyboardEvent, ReactNode } from "react";
import { Reminder } from "../../interfaces/RemindersInterfaces";
import { CircularProgress, TextField } from '@mui/material'
import "../../styling/ReminderDisplay.css"
import { useAddReminderMutation, useFetchRemindersQuery } from "../../app/remindersSliceRTKQ";


export const ReminderInputControlRTKQ = () => {

  const [inputValue, setInputValue] = useState<Reminder["value"]>("");

  // need to look at the fetch hook to see what data was fetched instead of looking purely at the store
  const {
    data: reminders = []
  } = useFetchRemindersQuery();
  const [ addReminder, { isLoading } ] = useAddReminderMutation()

  const setReminder = async () => {
    if (reminders.map(reminder => reminder.value).includes(inputValue)) {
      console.log("reminder already in list!");
      // TODO: replace with some sort of error banner
    } else if (inputValue === "") {
      console.log("cannot add empty reminder");
    } else {
      await addReminder({value: inputValue})
    }
    // clear current input field 
    setInputValue("");
  }

  const setReminderOnEnter = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      setReminder()
    }
  }

  let addPending: ReactNode;
  if (isLoading) {
    addPending = (<div>
      Adding...
      <CircularProgress />
    </div>)
  }

  return (
    <div className="input-container">
      <TextField onKeyDown={(event) => setReminderOnEnter(event)} placeholder="enter reminder" 
          onChange={(event) => setInputValue(event.target.value)} value={inputValue} />
      <button disabled={isLoading} onClick={() => setReminder()}>
        Click to add reminder
      </button>
      {addPending}
    </div>
    
  )
}