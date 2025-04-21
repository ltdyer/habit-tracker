export const postReminder = async (): Promise<{data: string}> => {
  return new Promise<{data: string}>((resolve) => {
    setTimeout(() => {
      resolve({
        data: "posted reminder asynchronously!"
      })
    }, 500)
  })
}