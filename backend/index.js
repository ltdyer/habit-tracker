const express = require('express');
const cors = require('cors')

const app = express();
// this is defined when you create the docker container and give it a .env file to use
// TODO: need to change this to add PROD
// I think we need to be able to have the backend identify what env its running in and change this port accordingly
const port = process.env.BACKEND_PORT ?? 3001;
const host = process.env.HOST
console.log(process.env.BACKEND_PORT)
const birdRoutes = require('./routes/birdRoutes')
const reminderRoutes = require('./routes/reminderRoutes')

// define cors for all requests because this is a private app and I don't care about CORS stuff. Just need it to not give me that stupid error
app.use(cors())

// define birds route
app.use('/birds', birdRoutes)
app.use('/reminders', reminderRoutes)

app.listen(port, () => {
  console.log(`backend listening on ${host}:${port}`)
})

app.get("/", (req, res) => {
  res.send("howdy")
})