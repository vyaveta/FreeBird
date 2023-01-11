const express = require('express')
const app = express()
const server = require('http').Server(app)
const next = require('next')

const dev = process.env.NODE_ENV!=='production'
const nextApp = next({dev})
const handle = nextApp.getRequestHandler()

require('dotenv').config() //{path:"./config.env"}
const connectDB = require('./utilsServer/connectDb')
const PORT = process.env.PORT || 3000
app.use(express.json()); // this is the body parser
connectDB()
nextApp.prepare().then(() => {

   app.use('/api/signup' , require('./pages/api/signup'))
   app.use('/api/auth' , require('./pages/api/auth'))
   app.use('/api/getUserDetails' , require('./pages/api/getUserDetails'))
   app.use('/api/search' , require('./pages/api/search'))
   app.use('/api/posts' , require('./pages/api/posts'))

    app.all('*' , (req,res) => handle(req,res))
    server.listen(PORT, err => {
        if(err) throw err
        console.log(`Express server running on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err,'is the error')
}) 
