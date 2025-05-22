export interface Reminder {
  _id: string
  value: string
}

export type ApiStatus = 'idle' | 'pending' | 'succeeded' | 'failed'
export type Error = string | null
