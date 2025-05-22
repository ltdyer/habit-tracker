import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Reminder } from "../interfaces/RemindersInterfaces";

export const remindersSliceRTKQ = createApi({
  /**
   * Reducerpath: should be the 'type' in a reducers {type, action} obj
   * baseUrl: the base Url of the api to call
   */
  reducerPath: "remindersRTKQ",
  baseQuery: fetchBaseQuery({
    baseUrl: '/reminders'
  }),
  endpoints: builder => ({
    // 1st arg is return type, 2nd is paramater type if it exists (otherwise void)
    fetchReminders: builder.query<Reminder[], void>({
      query: () => '/getAll'
    })
  })
})

export const {
  useFetchRemindersQuery
} = remindersSliceRTKQ