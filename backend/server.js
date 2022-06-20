const path = require('path')        // path module, part of node.js (a core package), which we'll use for deployment
const express = require('express')
const colors = require('colors')    
const dotenv = require('dotenv').config() 
const {errorHandler } = require('./middleware/errorMiddleware')   
const connectDB = require('./config/db')    
const port = process.env.PORT || 5000 

connectDB()

const app = express()   

app.use(express.json())                         
app.use(express.urlencoded({extended: false}))  

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))  

// server frontend (part of deployment)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))   // set our static folder
  /* express.static is what we use to create our static folder. path.join() 
  __dirname is the current directory (backend). We set our build folder to be in the frontend. This is where
  react will build out the static assets */

  // FOR THE ROUTE:
  app.get('*', (req, res) => 
  res.sendFile(
    path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
  /* remember that "*" is universal for "select all". As the second arg, we pass a func that sends the routes (apart
  from the ones above ^^^) to the html file that'll be created in the build folder. 

  path.resolve(): this is used to resolve a sequence of path-segments to an absolute path. It 
  works by processing the sequence of paths from right to left, prepending each of the paths until the absolute 
  path is created.
  */
} else {
  app.get('/', (req, res) => res.send('Please set to production.'))   // just in case it IS in production (???)
}

app.listen(port, () => console.log(`Server started on port ${port}`))   