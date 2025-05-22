import { AppThunk, RootState } from "./store";
import { createSlice, Action  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { client } from "../api/remindersAPI";
import { Reminder, ApiStatus, Error } from "../interfaces/RemindersInterfaces";
import { createAppAsyncThunk } from "./withTypes";

export interface RemindersState {
  reminders: Reminder[]
  add: { status: ApiStatus, error: Error }
  edit: { status: ApiStatus, error: Error }
  fetch: { status: ApiStatus, error: Error }
  delete: { status: ApiStatus, error: Error }
}

type ApiState = Pick<RemindersState, 'add'|'edit'|'fetch'|'delete'>

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
  add: { status: 'idle', error: null },
  edit: { status: 'idle', error: null },
  fetch: { status: 'idle', error: null },
  delete: { status: 'idle', error: null },
}

/**
 * this is a function that calls a function
 * since operation is a keyof our RemindersState interface, it is equivalent to the string
 * "reminders", "add", "edit", "fetch", or "delete"
 * so if we know operation isn't reminders, we can safely access RemindersState add, edit, etc property
 * and change its' status to be whatever we pass in (succeeded, pending, failed, etc)
 * This is called as setStatus("add", "succeeded")(state) where state is a RemindersState
 */
const setStatus = (operation: keyof RemindersState, status: ApiStatus) =>
  (state: RemindersState) => {
    if (operation !== "reminders"){
      state[operation].status = status
    }
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
      setStatus("fetch", "succeeded")(state)
      //state.status = 'succeeded'
      state.reminders.push(...action.payload);
    })
    .addCase(fetchReminders.pending, (state, action) => {
      console.log(action)
      setStatus("fetch", "pending")(state)
    })
    .addCase(fetchReminders.rejected, (state, action) => {
      setStatus("fetch", "failed")(state)
      if (action.payload !== undefined) {
        state.fetch.error = action.payload.errorMessage ?? 'Unknown error'
      }
    })
    .addCase(addReminder.fulfilled, (state, action) => {
      setStatus("add", "succeeded")(state)
      // state.status = 'succeeded'
      state.reminders.push(action.payload);
    })
    .addCase(addReminder.pending, (state, action) => {
      console.log(action)
      setStatus("add", "pending")(state)
    })
    .addCase(addReminder.rejected, (state, action) => {
      setStatus("add", "failed")(state)
      if (action.payload !== undefined) {
        state.add.error = action.payload.errorMessage ?? 'Unknown error'
      }
    })
    .addCase(deleteReminder.fulfilled, (state, action) => {
      setStatus("delete", "succeeded")(state)
      // state.status = 'succeeded'
      console.log(action.payload)
      // this creates a new array, does not directly edit original state
      state.reminders = state.reminders.filter((reminder) => {
        return reminder._id !== action.payload
      })
    })
    .addCase(deleteReminder.pending, (state, action) => {
      console.log(action)
      setStatus("delete", "pending")(state)
    })
    .addCase(deleteReminder.rejected, (state, action) => {
      setStatus("delete", "failed")(state)
      if (action.payload !== undefined) {
        state.delete.error = action.payload.errorMessage ?? 'Unknown error'
      }
    })
    .addCase(editReminder.fulfilled, (state, action) => {
      setStatus("edit", "succeeded")(state)
      // state.status = 'succeeded';
      // this creates a new array, does not edit original state
      // additionally, we are not adding a new reminder object in the new array, just modifying one field of the original
      // while keeping all other fields the same
      state.reminders = state.reminders.map((reminder) => {
        return reminder._id === action.payload._id ?  {...reminder, value: action.payload.value} : reminder
      })
    })
    .addCase(editReminder.pending, (state, action) => {
      console.log(action)
      setStatus("edit", "pending")(state)
    })
    .addCase(editReminder.rejected, (state, action) => {
      setStatus("edit", "failed")(state)
      if (action.payload !== undefined) {
        state.edit.error = action.payload.errorMessage ?? 'Unknown error'
      }
    })

    // since every pending and rejected case is the same, we can add matchers that will 
    // provide a baseline for every case rather than repeating
    // UPDATE: now everything is different and as of right now we cannot have all the oending and rejected actions
    // be the same
    .addMatcher(isPendingAction, (state, action) => {
      // should be able to access action.meta.requestStatus and set as 'pending'
      // nut for some some stupid reason I am unable to do so
      console.log(action)
      // state.status = 'pending'
    })
    .addMatcher(isRejectedAction, (state, action) => {
      // state.status = 'failed'
      // because we established that rejectWithValue takes in an InputError
      // the payload here knows that there should be an errorMessage field we can access
      // state.error = action.payload.errorMessage ?? 'Unknown error'
    })
  },
})

export const {removeReminder, rearrangeReminders} = remindersSlice.actions;

export default remindersSlice.reducer

export const selectReminders = (state: RootState) => state.reminders.reminders
// instead of returning just reminders.status, we should see if there is a way to 
// go through each key in RemindersState (that isn't reminders). If any is pending or failed or succeeded then
// make the status pending or failed or succeeded. Otherwise, status is idle
// export const remindersStatus = (state: RootState) => state.reminders.status
// export const errorMessage = (state: RootState) => state.reminders.error
export const newRemindersStatus = (state: RootState): ApiStatus => {
  if (state.reminders.add.status === 'failed' || state.reminders.delete.status === 'failed' || state.reminders.edit.status === 'failed' || state.reminders.fetch.status === 'failed') {
    return 'failed'
  } else if (state.reminders.add.status === 'pending' || state.reminders.delete.status === 'pending' || state.reminders.edit.status === 'pending' || state.reminders.fetch.status === 'pending') {
    return 'pending'
  } else if (state.reminders.add.status === 'succeeded' || state.reminders.delete.status === 'succeeded' || state.reminders.edit.status === 'succeeded' || state.reminders.fetch.status === 'succeeded') {
    return 'succeeded'
  }
  return 'idle'
}

export const remindersStatusObj = (state: RootState) => {
  return {
    'add': state.reminders.add.status,
    'fetch': state.reminders.fetch.status,
    'edit': state.reminders.edit.status,
    'delete': state.reminders.delete.status
  }
}
 
export const newErrorMessage = (state: RootState): Error => {
  if (state.reminders.add.error !== null) {
    return state.reminders.add.error
  } else if (state.reminders.fetch.error !== null) {
    return state.reminders.fetch.error
  } else if (state.reminders.edit.error !== null) {
    return state.reminders.edit.error
  } else if (state.reminders.delete.error !== null) {
    return state.reminders.delete.error
  }
  return null
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
      const status = newRemindersStatus(thunkApi.getState());
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
