
const mongoose= require('mongoose');
const Schema=mongoose.Schema;
mongoose.set('useFindAndModify', false);

const professorSchema = new Schema({

    professorUserName:{type:String,required:true,unique:true },
    password:{type:String,required:true },
    firstName:{type:String},
    lastName:{type:String},
    emailId:{type:String,unique: true}


},{ collection : 'professors' },{
    versionKey: false
});

const Professor= mongoose.model('professors',professorSchema);

module.exports =Professor;