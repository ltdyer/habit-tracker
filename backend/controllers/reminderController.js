export const getReminders = ((req, res) => {
  res.status(200).json([{value: "initial reminder", id: 1}]) 
  // throw new Error("Error! AHHHH")
})