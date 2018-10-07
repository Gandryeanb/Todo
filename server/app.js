require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import userRoute from './routes/userRoute'
import taskRoute from './routes/taskRoute'
import weatherRoute from './routes/weatherRoute'
import quoteRoute from './routes/quoteRoute'

const app = express()
const dbTesting = null
const dbProd = null
const dbDev = 'mongodb://localhost/TodoDev'
const port = process.env.HOST
const db = mongoose.connection
const mongooseNewParser = {useNewUrlParser: true}

app.use(cors())

mongoose.set('useCreateIndex', true)
dbTesting ? mongoose.connect(dbTesting, mongooseNewParser) 
  : dbProd ? mongoose.connect(dbProd, mongooseNewParser)
    : mongoose.connect(dbDev, mongooseNewParser)

db
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', function() {
    console.log('> DB Connected')
  })

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use('/users', userRoute)
  .use('/task', taskRoute)
  .use('/weather', weatherRoute)
  .use('/quote', quoteRoute)

  .get('/', (req, res) => {
    res.status(200).json({
      msg: 'Server on'
    })
  })

  .listen(port, () => {
    console.log(`\n> Server running on port ${port}`)
  })
