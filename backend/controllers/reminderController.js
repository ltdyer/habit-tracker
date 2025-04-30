export const getReminders = ((req, res) => {
  res.status(200).json([{value: "initial reminder", id: 0}])
})