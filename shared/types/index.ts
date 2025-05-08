export interface AddReminderRequestBody {
  value: string
}

export interface AddReminderResponseBody {
  _id: string,
  value: string
}

// TODO: planning to share types between node and react
// here are references:
// https://andrejgajdos.com/typescript-type-sharing-between-react-and-node-js/
// https://chatgpt.com/c/681cc54c-fb30-800e-ba89-8fcee585c193