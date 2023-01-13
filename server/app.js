const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const history = require('connect-history-api-fallback')
const router = require('./router')
const errorHandler = require('./middleware/error-handler')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(history())
app.use('/api', router)

app.use(express.static('public'))
app.use(express.static('public/dist'))

app.use(errorHandler())

app.listen(3001, () => {
  console.log('server is running successful!')
})
