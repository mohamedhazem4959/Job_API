require('express-async-errors')
const express = require('express')
const app = express()
require('dotenv').config();
//connection database
const connectDB = require('./connectdb/connection.js')
//Routes
const auth_route = require('./routes/R-auth.js')
const jobs_route = require('./routes/R-jobs.js')
//error middlewares
const errorHandler = require('./middleware/errorHandling.js')
const notFound = require('./middleware/not-Found.js')
//auth middleware
const authenticatieUser = require('./middleware/authernication.js')
//.env variables
const port = process.env.PORT || 5000
const DB_url = process.env.MONGO_URL;



app.use(express.json()) // body parase

//api route
app.use('/api/v1/auth',auth_route)
app.use('/api/v1/jobs',authenticatieUser,jobs_route)

//error handling middlewares
app.use(notFound)
app.use(errorHandler)

const start = async()=>{
    try {
        await connectDB(DB_url)
        app.listen(port , console.log(`server is listing on port: ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start();