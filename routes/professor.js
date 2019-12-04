const router = require('express').Router();
let Professor = require('../models/professors.model')
const bcrypt = require('bcryptjs');



router.route('/authentication').post(async (req,res)=>{

     try {
        var user = await Professor.findOne({ professorUserName: req.body.professorUserName }).exec();
        if(!user) {
            return res.status(400).send({ status:404,message: "The username does not exist" });
        }
        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({status:404, message: "The password is invalid" });
        }
        res.send({status:200,message:'Professor authenticated!'});
    } catch (error) {
        res.status(500).send(error);
    }
   });


router.route('/add').post((req,res)=>{
    const professorUserName =req.body.professorUserName;
   const password = bcrypt.hashSync(req.body.password, 10);
   const firstName=req.body.firstName;
   const lastName=req.body.lastName;
   const   emailId=req.body.emailId;
    const newProfessor = new Professor({professorUserName,password,firstName,lastName,emailId });
    newProfessor.save()
   .then(() => res.json('Professor added!'))
   .catch(err => res.status(400).json('Error:' +err))
})




module.exports = router;