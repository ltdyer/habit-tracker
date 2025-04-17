export interface Reminder {
  status: "loading" | "idle" | "failed",
  value: string
}
