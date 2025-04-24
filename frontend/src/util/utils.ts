export const runningInDev = (): boolean => {
  return import.meta.env.DEV;
}