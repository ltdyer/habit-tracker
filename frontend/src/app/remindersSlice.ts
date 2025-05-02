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

export interface InputError {
  errorMessage: string
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
    removeReminder: (state, action: PayloadAction<Reminder>) => {
      // this creates a new array, does not directly edit original state
      state.reminders = state.reminders.filter((reminder) => {
        return reminder.id !== action.payload.id
      })
    },
    editReminder: (state, action: PayloadAction<Reminder>) => {
      // this creates a new array, does not edit original state
      // additionally, we are not adding a new reminder object in the new array, just modifying one field of the original
      // while keeping all other fields the same
      state.reminders = state.reminders.map((reminder) => {
        return reminder.id === action.payload.id ?  {...reminder, value: action.payload.value} : reminder
      })
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
    .addCase(fetchReminders.rejected, (state, action) => {
      state.status = 'failed'
      // because we established that rejectWithValue takes in an InputError
      // the payload here knows that there should be an errorMessage field we can access
      state.error = action.payload?.errorMessage ?? 'Unknown error'
    })
  },
})

export const {addReminder, removeReminder, editReminder} = remindersSlice.actions;

export default remindersSlice.reducer

export const selectReminders = (state: RootState) => state.reminders.reminders
export const remindersStatus = (state: RootState) => state.reminders.status
export const errorMessage = (state: RootState) => state.reminders.error

// mostly just to show Thunks in action, not really useful for our case
// export const addReminderKeyboard = (event: KeyboardEvent): AppThunk => {
//   return (dispatch, getState: () => RootState) => {
//     const stateBefore = getState();
//     console.log(stateBefore)
//     if (event.key.toLowerCase() === 'enter') {
//       dispatch(addReminder({value: "created reminder with Thunk!"}))
//     }
//   }
// }

// there are also async thunks for API calls, probably similar to RTK Query
// this first arg is the redux action type like reminders/addReminder or reminders/removeReminders
export const fetchReminders = createAppAsyncThunk<
  // Return type of the payload creator (what you expect to return from 'reminders/getAllReminders')
  Reminder[],
  // Return type of the argument passed into the thunk (here, it is arg which is nothing so void)
  // if it needed to be a clinetID or something, it would be a string/number/etc
  void,
  // an object that lets you specify additional typings. We need to confirm the typing of the the argument gooing into RejectWithValue
  // this is the syntax for that
  {
    rejectValue: InputError
  }
>(
  'reminders/getAllReminders',
  async (
    arg, // if we needed to send in a clientID or something, that would go where arg is
    thunkApi) => {
    try {
      const response = await client.get('/reminders/getAll');
      return response.data as Reminder[];
    } catch(err: any) {
      const error: InputError = { errorMessage: err?.message || 'Unknown error' };
      return thunkApi.rejectWithValue(error);
    }
  },
  // optional 3rd argument to AsyncThunk
  // takes in an arg, and api which access the current thunk request
  // this runs before the thunk and if the status is not idle (i.e no request made yet), it will allow the thunk to continue
  // however, if a thunk is currently running and another request is made (not idle), it returns false and cancels the 2nd request
  // done to prevent React strictMode from executing two requests
  // RTK Query implements something similar automatically so we don't need to worry about manually writing this
  {
    condition(arg, thunkApi) {
      const status = remindersStatus(thunkApi.getState());
      if (status !== 'idle') {
        return false
      }
    }
  }, 
)
