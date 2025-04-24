import { AppThunk, RootState } from "./store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { client } from "../api/remindersAPI";
import { Reminder } from "../interfaces/RemindersInterfaces";
import { createAppAsyncThunk } from "./withTypes";

export interface RemindersState {
  reminders: Reminder[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: RemindersState = {
  reminders: [],
  status: 'idle',
  error: null
}

export const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    // safe to just directly edit state since Redux uses Immer under the hood to ensure immutability
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    removeReminder: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = [...action.payload]
    }
  },
  extraReducers(builder) {
    builder
    .addCase(fetchReminders.pending, state => {
      state.status = 'pending'
      // state.reminders.forEach((reminder: Reminder) => {
      //   reminder.status = 'loading'
      // })
    })
    .addCase(fetchReminders.fulfilled, (state, action) => {
      state.status = 'succeeded'
      // state.reminders.forEach((reminder: Reminder) => {
      //   reminder.status = 'idle'
      // })
      state.reminders.push(...action.payload);
    })
    .addCase(fetchReminders.rejected, state => {
      state.status = 'failed'
      // state.reminders.forEach((reminder: Reminder) => {
      //   reminder.status = 'failed'
      // })
    })
  },
})

export const {addReminder, removeReminder} = remindersSlice.actions;

export default remindersSlice.reducer

export const selectReminders = (state: RootState) => state.reminders.reminders

// mostly just to show Thunks in action, not really useful for our case
export const addReminderKeyboard = (event: KeyboardEvent): AppThunk => {
  return (dispatch, getState: () => RootState) => {
    const stateBefore = getState();
    console.log(stateBefore)
    if (event.key.toLowerCase() === 'enter') {
      dispatch(addReminder({value: "created reminder with Thunk!"}))
    }
  }
}

// there are also async thunks for API calls, probably similar to RTK Query
// this first arg is the redux action type like reminders/addReminder or reminders/removeReminders
export const fetchReminders = createAppAsyncThunk(
  'reminders/getAllReminders',
  async () => {
    const response = await client.get('/reminders/getAll');
    console.log(response)
    return response.data;
  }
)
