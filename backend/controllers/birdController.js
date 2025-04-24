export const getBirds = ((req, res) => {
  res.status(200).json([{name: "red-tailed swallow"}, {name: "huge bird"}])
})