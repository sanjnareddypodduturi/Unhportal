const router = require('express').Router();
let Course = require('../models/courses.model')

router.route('/').get((req,res)=>{
    Course.find()
    .then(courses => res.json(courses))
    .catch(err => res.status(400).json('Error:' +err));
});

router.route('/:department/:term/:year').get((req,res)=>{
    Course.find({department:req.params.department,Term:req.params.term,Year:req.params.year})
    .then(courses => res.json(courses))
    .catch(err => res.status(400).json('Error:' +err));
});


router.route('/years').get((req,res)=>{
    Course.find({},{Year:1,_id: 0})
    .then(courses => {
        let years=new Set();
 for(let i =0; i<courses.length;i++)
        {
            years.add(courses[i].Year)
        }

        res.send( Array.from(years))})
    .catch(err => res.status(400).json('Error:' +err));
});

router.route('/department/:department').get((req,res)=>{
    Course.find({department:req.params.department},{_id: 0})
    .then(courses => {
        res.json(courses )})
    .catch(err => res.status(400).json('Error:' +err));
});
router.route('/departments').get((req,res)=>{
    Course.find({},{department:1,_id: 0})
    .then(courses => {
        let departments=new Set();
 for(let i =0; i<courses.length;i++)
        {
            departments.add(courses[i].department)
        }

        res.send( Array.from(departments))})
    .catch(err => res.status(400).json('Error:' +err));
});
router.route('/authenticate').post((req,res)=>{
    const userName =req.body.userName;
    const password=req.body.password;
Course.findOne({ userName: userName,password:password})
    .exec(function (err, User) {
      if (err) {
       res.send(err)
      } else if (!User) {
        var err = new Error('User not found.');
        err.status = 401;
        err.message=" user not authenticated"
        return res.send(err);
      }
      else{
        res.json({status:200,message:'User authenticated!'})
      }

})
    });

router.route('/add').post((req,res)=>{

    const courseId =req.body.courseId;
    const CRNNO=req.body.CRNNO;
   const Term=req.body.Term;
   const courseName=req.body.courseName;
  const   Year=req.body.Year;
const   department=req.body.department;
const professorUserName=req.body.professorUserName;
    const newUser = new Course({courseId,CRNNO,Term,courseName,Year,department,professorUserName });

    newUser.save()
   .then(() => res.json('User added!'))
   .catch(err => res.status(400).json('Error:' +err))
})

router.route('/:userName').get((req, res) => {
  Course.find({"userName":req.params.userName})
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/update/:userName').post((req, res) => {
  Course.findOneAndUpdate({"userName":req.params.userName})
    .then(users => {
      users.password=req.body.password;
      users.firstName=req.body.firstName;
      users.lastName=req.body.lastName;
      users.save()
        .then(() => res.json('user updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;