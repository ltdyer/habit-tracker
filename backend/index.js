const express = require('express');
const app = express();
// this is defined when you create the docker container and give it a .env file to use
const port = process.env.BACKEND_PORT_PROD ?? 3001;
const host = process.env.HOST
const birdsRoute = require('./routes/birds')

app.use('/birds', birdsRoute)

app.listen(port, () => {
  console.log(`backend listening on ${host}:${port}`)
})

app.get("/", (req, res) => {
  res.send("howdy")
})