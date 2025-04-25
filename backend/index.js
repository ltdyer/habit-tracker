const express = require('express');
const cors = require('cors')

const app = express();
// process.env is based on either if you give docker-compose file a env-file argument to use or if you set
// an ENV argument in the Dockerfile. 
const port = process.env.BACKEND_PORT
const host = process.env.HOST
console.log(process.env)
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