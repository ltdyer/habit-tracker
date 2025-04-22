import { useState, KeyboardEvent } from 'react'
import { Reminder } from '../interfaces/RemindersInterfaces';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectReminders, addReminder, removeReminder } from '../app/remindersSlice';

export const ReminderDisplay = () => {
  const [inputValue, setInputValue] = useState<Reminder["value"]>("");
  const dispatch = useAppDispatch();
  const reminders = useAppSelector(selectReminders)

  const setReminder = () => {
    if (reminders.map(reminder => reminder.value).includes(inputValue)) {
      console.log("reminder already in list!");
      // replace with some sort of error banner
    } else {
       dispatch(addReminder(inputValue))
    }
  }

  const addReminderOnEnter = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      setReminder()
    }
  }

  const deleteReminder = (reminderToRemove: string) => {
    const filteredReminders = reminders.filter((reminderToKeep: Reminder) => reminderToRemove != reminderToKeep.value);
    dispatch(removeReminder(filteredReminders))

  }

  const showReminders = () => {
    return reminders.map((reminder: Reminder) => {
      return (
        <li key={reminder.value}>
          <button onClick={() => deleteReminder(reminder.value)}>{reminder.value}</button>
        </li>
      )
    })
  }

  return (
    <>
      <h1>Reminders howdy</h1>
      <h2>{import.meta.env.MODE}</h2>
      <h2>{import.meta.env.VITE_APP_BACKEND_ADDRESS}</h2>
      <div className="card">
        <input onKeyDown={(event) => addReminderOnEnter(event)} placeholder="enter reminder" 
          onChange={(event) => setInputValue(event.target.value)} value={inputValue} />
        <button onClick={() => setReminder()}>
          Click to add reminder
        </button>
        <ul>
          {showReminders()}
        </ul>
      </div>
    </>
  )
}

