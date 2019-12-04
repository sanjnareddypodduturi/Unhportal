
const mongoose= require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
const Schema=mongoose.Schema;
mongoose.set('useFindAndModify', false);

const enrollCourseSchema = new Schema({

    courseId:{type:Number,required:true},
    CRNNO: {type:Number,required:true},
     Term:{type:String,required:true},
    Year:{type:Number,required:true},
    department:{type:String,required:true},
    userName:{type:String,required:true},
     userId:{type:Number,required:true},
    grade:{type:String,required:true},
    professorUserName:{type:String,required:true},

},{ collection : 'enrollCourses' },{
    versionKey: false
});

const course= mongoose.model('enrollCourses',enrollCourseSchema);

module.exports =course;

