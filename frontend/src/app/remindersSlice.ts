import { AppThunk, RootState } from "./store";
import { createSlice, Action  } from "@reduxjs/toolkit";
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

// use this Pick utility to take an existing Interface and create a new type from it with only select fields
// here I want to send a Reminder as body input to addReminder but since MongoDB takes care of ID generation
// I don't want to send it with an ID. SO I make a new Reminder type that is a Reminder but without that _id
type NewReminder = Pick<Reminder, 'value'>;


// Action definitions to tell Redux how it should define a Pending or Rejected action.
// Need to include a RejectedAction interface because we need to check the action payload for data to display
// but don't need to do anything special for Pending
function isPendingAction(action: Action) {
  return action.type.endsWith('pending')
}

interface RejectedAction extends Action {
  payload: {
    errorMessage: string
  }
}
function isRejectedAction(action: Action): action is RejectedAction {
  return action.type.endsWith('rejected')
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
    removeReminder: (state, action: PayloadAction<Reminder>) => {
      // this creates a new array, does not directly edit original state
      state.reminders = state.reminders.filter((reminder) => {
        return reminder._id !== action.payload._id
      })
    },
    editReminder: (state, action: PayloadAction<Reminder>) => {
      // this creates a new array, does not edit original state
      // additionally, we are not adding a new reminder object in the new array, just modifying one field of the original
      // while keeping all other fields the same
      state.reminders = state.reminders.map((reminder) => {
        return reminder._id === action.payload._id ?  {...reminder, value: action.payload.value} : reminder
      })
    }
  },
  extraReducers(builder) {
    builder
    .addCase(fetchReminders.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.reminders.push(...action.payload);
    })
    .addCase(addReminder.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.reminders.push(action.payload);
    })
    // since every pending and rejected case is the same, we can add matchers that will 
    // provide a baseline for every case rather than repeating
    .addMatcher(isPendingAction, (state, action) => {
      state.status = 'pending'
    })
    .addMatcher(isRejectedAction, (state, action) => {
      state.status = 'failed'
      // because we established that rejectWithValue takes in an InputError
      // the payload here knows that there should be an errorMessage field we can access
      state.error = action.payload.errorMessage ?? 'Unknown error'
    })
  },
})

export const {removeReminder, editReminder} = remindersSlice.actions;

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

export const addReminder = createAppAsyncThunk<
  Reminder,
  NewReminder,
  {
    rejectValue: InputError
  }
>(
  'reminder/addReminder',
  async (
    newReminder: NewReminder, // if we needed to send in a clientID or something, that would go where arg is
    thunkApi) => {
      try {
        const response = await client.post('/reminders/addReminder', newReminder);
        console.log(response)
        return response.data as Reminder;
      } catch(err: any) {
        const error: InputError = { errorMessage: err?.message || 'Unknown error' };
        return thunkApi.rejectWithValue(error);
      }
    
  }
)
