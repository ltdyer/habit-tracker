import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import remindersReducer from "./remindersSlice";

// set up store with as many reducers as you need
export const store = configureStore({
  reducer: {
    // add reducers here
    reminders: remindersReducer
  }
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