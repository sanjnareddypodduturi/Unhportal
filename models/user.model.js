
const mongoose= require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
const Schema=mongoose.Schema;
mongoose.set('useFindAndModify', false);
autoIncrement.initialize(mongoose.connection)
const userSchema = new Schema({

    userName:{type:String,required:true,unique:true },
    userId: {type:Number},
      password:{type:String,required:true },
    firstName:{type:String},
    lastName:{type:String},
     emailId:{type:String,unique: true},
    dob:{type:Date},
    department:{type:String},
    degree:{type:String}

},{ collection : 'users' },{
    versionKey: false
});
userSchema.plugin(autoIncrement.plugin, { model: 'Users', field: 'userId', startAt: 1000,incrementBy: 1 });
const User= mongoose.model('Users',userSchema);

module.exports =User;