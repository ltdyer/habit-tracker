import { AppThunk, RootState } from "./store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { postReminder } from "../api/remindersAPI";
import { Reminder } from "../interfaces/RemindersInterfaces";

export interface RemindersState {
  reminders: Reminder[]
}

const initialState: RemindersState = {
  reminders: []
}

export const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    addReminder: (state, action: PayloadAction<string>) => {
      state.reminders = [...state.reminders, {status: 'idle',value: action.payload}]
    },
    removeReminder: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = [...action.payload]
    }
  },
  extraReducers(builder) {
    builder
    .addCase(addReminderAsync.pending, state => {
      state.reminders.forEach((reminder: Reminder) => {
        reminder.status = 'loading'
      })
    })
    .addCase(addReminderAsync.fulfilled, (state, action) => {
      state.reminders.forEach((reminder: Reminder) => {
        reminder.status = 'idle'
      })
      state.reminders = [...state.reminders, {status: 'idle', value: action.payload}]
    })
    .addCase(addReminderAsync.rejected, state => {
      state.reminders.forEach((reminder: Reminder) => {
        reminder.status = 'failed'
      })
    })
  },
})

export const {addReminder, removeReminder} = remindersSlice.actions;

export default remindersSlice.reducer

export const selectReminders = (state: RootState) => state.reminders.reminders

// mostly just to show Thunks in action, not really useful for our case
export const addReminderKeyboard = (event: KeyboardEvent):  AppThunk => {
  return (dispatch) => {
    if (event.key.toLowerCase() === 'enter') {
      dispatch(addReminder("created reminder with Thunk!"))
    }
  }
}

// there are also async thunks for API calls, probably similar to RTK Query
export const addReminderAsync = createAsyncThunk(
  'reminders/addReminderAsync',
  async () => {
    const response = await postReminder();
    return response.data;
  }
)
