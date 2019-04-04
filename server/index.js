const express = require('express')
require('dotenv').config()
const massive = require('massive')
const session = require('express-session')

const AuthCtrl = require('./controllers/Auth')

const app = express()

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('db is connected')
})

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365
  }
}))

app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.login)
app.get('/auth/logout', AuthCtrl.logout)

app.listen(SERVER_PORT, () => {
  console.log('listening on port', SERVER_PORT)
})