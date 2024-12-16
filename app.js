const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const port = 3000
const app = express()

const UserRoute = require('./routes/userRoute')

mongoose
    .connect('mongodb://localhost:27017/instagram')
    .then(() => {
        console.log('db is connected')
    })
    .catch((err) => {
        console.log('error while connecting the db')
    })

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/users', UserRoute)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
