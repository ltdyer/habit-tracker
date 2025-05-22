import { AppThunk, RootState } from "./store";
import { createSlice, Action, isAnyOf, isRejectedWithValue  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { client } from "../api/remindersAPI";
import { Reminder, ApiStatus, Error } from "../interfaces/RemindersInterfaces";
import { createAppAsyncThunk } from "./withTypes";
import { AppStartListening } from "./listenerMiddleware";

export interface RemindersState {
  reminders: Reminder[]
  status: ApiStatus
  error: Error
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
    // not using this but want to keep at least one example of a non-async reducer lol
    removeReminder: (state, action: PayloadAction<Reminder>) => {
      // this creates a new array, does not directly edit original state
      state.reminders = state.reminders.filter((reminder) => {
        return reminder._id !== action.payload._id
      })
    },
    rearrangeReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
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
    .addCase(deleteReminder.fulfilled, (state, action) => {
      state.status = 'succeeded'
      console.log(action.payload)
      // this creates a new array, does not directly edit original state
      state.reminders = state.reminders.filter((reminder) => {
        return reminder._id !== action.payload
      })
    })
    .addCase(editReminder.fulfilled, (state, action) => {
      state.status = 'succeeded';
      // this creates a new array, does not edit original state
      // additionally, we are not adding a new reminder object in the new array, just modifying one field of the original
      // while keeping all other fields the same
      state.reminders = state.reminders.map((reminder) => {
        return reminder._id === action.payload._id ?  {...reminder, value: action.payload.value} : reminder
      })
    })

    // since every pending and rejected case is the same, we can add matchers that will 
    // provide a baseline for every case rather than repeating
    // UPDATE: now everything is different and as of right now we cannot have all the oending and rejected actions
    // be the same
    // UPDATE 2: I am now able to revert it to its original simple state since Middleware can handle the toasts which is the only reason
    // I thought I needed to make the state more complex
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

export const {removeReminder, rearrangeReminders} = remindersSlice.actions;

export default remindersSlice.reducer

export const selectReminders = (state: RootState) => state.reminders.reminders
// instead of returning just reminders.status, we should see if there is a way to 
// go through each key in RemindersState (that isn't reminders). If any is pending or failed or succeeded then
// make the status pending or failed or succeeded. Otherwise, status is idle
export const remindersStatus = (state: RootState) => state.reminders.status
export const errorMessage = (state: RootState) => state.reminders.error

// this is now listening for any addReminder.fullfilled action dispatches and shows a toast if one happens
export const addReminderListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: addReminder.fulfilled,
    effect: async (action, listenerApi) => {
      const { toast } = await import('react-tiny-toast')
      const toastId = toast.show("New Reminder Added", {
        variant: 'success',
        position: 'top-right',
        pause: true
      })
      await listenerApi.delay(5000)
      toast.remove(toastId)
    }
  })
}
// this is now listening for any deleteReminder.fullfilled action dispatches and shows a toast if one happens
export const deleteReminderListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: deleteReminder.fulfilled,
    effect: async (action, listenerApi) => {
      const { toast } = await import('react-tiny-toast')
      const toastId = toast.show("Reminder Deleted", {
        variant: 'success',
        position: 'top-right',
        pause: true
      })
      await listenerApi.delay(5000)
      toast.remove(toastId)
    }
  })
}

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
  'reminders/addReminder',
  async (
    newReminder: NewReminder, 
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

export const deleteReminder = createAppAsyncThunk<
  string,
  string,
  {
    rejectValue: InputError
  }
>(
  'reminders/deleteReminder',
  async (
    reminderId: string,
    thunkApi
  ) => {
    try {
      const response = await client.post(`/reminders/deleteReminder/${reminderId}`, {})
      return response.data?._id;
    } catch (err: any) {
      const error: InputError = { errorMessage: err?.message || 'Unknown error' };
      return thunkApi.rejectWithValue(error);
    }
  }
)

export const editReminder = createAppAsyncThunk<
  Reminder,
  Reminder,
  {
    rejectValue: InputError
  }
>(
  'reminders/editReminder',
  async (
    editedReminder: Reminder,
    thunkApi
  ) => {
    try {
      const response = await client.post('/reminders/editReminder', editedReminder);
      console.log(response);
      return response.data as Reminder;
    } catch (err: any) {
      const error: InputError = { errorMessage: err?.message || 'Unknown error' };
      return thunkApi.rejectWithValue(error);
    }
  }
)
