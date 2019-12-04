const router = require('express').Router();
let User = require('../models/user.model')
const bcrypt = require('bcryptjs');
router.route('/').get((req,res)=>{
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error:' +err));
});
router.route('/:department').get((req,res)=>{
    User.find({department:req.params.department})
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error:' +err));
});

router.route('/authenticate').post(async (req,res)=>{

     try {
        var user = await User.findOne({ userName: req.body.userName }).exec();
        if(!user) {
            return res.status(400).send({ status:404,message: "The username does not exist" });
        }
        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({status:404, message: "The password is invalid" });
        }
        res.send({status:200,message:'User authenticated!'});
    } catch (error) {
        res.status(500).send(error);
    }
   });


router.route('/user/:userName').get((req, res) => {
  User.find({"userName":req.params.userName})
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').post((req,res)=>{
    const userName =req.body.userName;
const password = bcrypt.hashSync(req.body.password, 10);
   const firstName=req.body.firstName;
   const lastName=req.body.lastName;
  const   emailId=req.body.emailId;
  const  dob=new Date(req.body.dob);
  const   userId=req.body.userId;
 const degree=req.body.degree;
 const department=req.body.department;


     const newUser = new User({userName,userId,password,firstName,lastName,emailId ,dob,degree,department});
    newUser.save()
   .then(() => res.json('User added!'))
   .catch(err => res.status(400).json('Error:' +err))
})




module.exports = router;