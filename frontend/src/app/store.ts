import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import remindersReducer from "./remindersSlice";
import { remindersSliceRTKQ } from "./remindersSliceRTKQ";

import { listenerMiddleware } from "./listenerMiddleware";

// set up store with as many reducers as you need
export const store = configureStore({
  reducer: {
    // add reducers here
    reminders: remindersReducer,
    [remindersSliceRTKQ.reducerPath]: remindersSliceRTKQ.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      // this middleware is just from the tutorial. Not really using it
      // but essentially it can be used to listen for post requests
      // and show a toast when a reminder gets added vs deleted
      // which would have drastically simplified the new changes we made to remindersSlice
      .prepend(listenerMiddleware.middleware)
      .concat(remindersSliceRTKQ.middleware)
})

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>