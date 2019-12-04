const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
const path = require('path');
const session = require('express-session')
require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 25
const app = express();

const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));
//midleware
const uri = process.env.MONGODB_URI || process.env.ATLAS_URI;
mongoose.connect(uri,{ useNewUrlParser:true, useCreateIndex: true,useUnifiedTopology: true,dbName: 'Portal' });

//database connection
const connection =mongoose.connection;
autoIncrement.initialize(connection)
connection.once('open',()=>{
    console.log("MongoDB connection established");
})

//for excersise and users
const usersRouter= require('./routes/users');

const courseRouter= require('./routes/courses');
const enrollCourseRouter= require('./routes/EnrollCourse');
const professorRouter= require('./routes/professor');
app.use('/users',usersRouter);
app.use('/professor',professorRouter);
app.use('/courses',courseRouter);
app.use('/enrollCourses',enrollCourseRouter);

//server static assets

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'));

    app.get('*', function (req,res) {
        const index = (path.join(__dirname, 'frontend','build','index.html'));
    });
}


//for server
app.listen(port,() =>{
    console.log(`server running on port : ${port}`)
});


connection.on('close', () => {
    connection.removeAllListeners();
});