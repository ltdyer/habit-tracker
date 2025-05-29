import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Reminder } from "../interfaces/RemindersInterfaces";
import { NewReminder } from "./remindersSlice";

export const remindersSliceRTKQ = createApi({
  /**
   * Reducerpath: should be the 'type' in a reducers {type, action} obj
   * baseUrl: the base Url of the api to call
   */
  reducerPath: "remindersRTKQ",
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/reminders'
  }),
  tagTypes: ['Reminder'],
  endpoints: builder => ({
    // 1st arg is return type, 2nd is paramater type if it exists (otherwise void)
    fetchReminders: builder.query<Reminder[], void>({
      query: () => '/getAll',
      // providesTags can also receive a callback function
      // this is saying "this cache can be invalidated by the Reminder tag but it also is making a unique tag for each
      // result returned from the api based on its id"
      // this means that when one reminder is edited, only that reminder would be refetched.
      // this is useful in the docs example because they have a separate individual edit posts page where you 
      // only want to fetch one specific post if it is the only one edited.
      // not useful here but good to know
      providesTags: (result = []) => [
        'Reminder',
        ...result.map(({ _id }) => ({ type: 'Reminder', _id}) as const)
      ]
    }),
    addReminder: builder.mutation<Reminder, NewReminder>({
      query: (initialReminder) => ({
        url: '/addReminder',
        method: 'POST',
        body: initialReminder
      }),
      // by using this tag, we can invalidate this cache entry when a new reminder is added
      // this forces rtk query to recall the api which will update our data with the new added reminder
      invalidatesTags: ["Reminder"]
    }),
    editReminder: builder.mutation<Reminder, Reminder>({
      query: (editedReminder) => ({
        url: '/editReminder',
        method: 'POST',
        body: editedReminder
      }),
      invalidatesTags: ["Reminder"]
    }),
    deleteReminder: builder.mutation<string, string>({
      query: (reminderId) => ({
        url: `/deleteReminder/${reminderId}`,
        method: 'POST'
      }),
      invalidatesTags: ["Reminder"]
    })
  })
})

export const {
  useFetchRemindersQuery,
  useAddReminderMutation,
  useEditReminderMutation,
  useDeleteReminderMutation
} = remindersSliceRTKQ