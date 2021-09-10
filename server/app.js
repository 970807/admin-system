const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const router = require('./router')
const errorHandler = require('./middleware/error-handler')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(router)

app.use(errorHandler())

app.listen(3000, () => {
  console.log('server is running successful!')
})
