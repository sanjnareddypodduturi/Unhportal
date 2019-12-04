
const mongoose= require('mongoose');
const Schema=mongoose.Schema;
mongoose.set('useFindAndModify', false);

const courseSchema = new Schema({

    courseId:{type:Number,required:true},
    CRNNO: {type:Number,required:true },
    Days:{type:String,required:true},
    courseName:{type:String,required:true},
    Professor:{type:String,required:true},
     Term:{type:String,required:true},
    Year:{type:Number,required:true},
     department:{type:String,required:true},
    professorUserName:{type:String,required:true},


},{ collection : 'courses' },{
    versionKey: false
});

const course= mongoose.model('courses',courseSchema);

module.exports =course;

