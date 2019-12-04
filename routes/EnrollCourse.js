const router = require('express').Router();
let enrollCourse = require('../models/EnrollCourse.model')

router.route('/enrollments/professor/:department/:professorUserName').get((req,res)=>{

enrollCourse.find({ department: req.params.department,professorUserName:req.params.professorUserName})
    .then(courses =>{
        res.json(courses)
   })
    .catch(err => res.status(400).json('Error:' +err));
 });
router.route('/grade/:professorUserName/:department/:term/:year').get((req,res)=>{
    enrollCourse.find({professorUserName:req.params.professorUserName,department:req.params.department,Term:req.params.term,Year:req.params.year})
    .then(courses => res.json(courses))
    .catch(err => res.status(400).json('Error:' +err));
});


router.route('/years').get((req,res)=>{
    enrollCourse.find({},{Year:1,_id: 0})
    .then(courses => {
        let years=new Set();
 for(let i =0; i<courses.length;i++)
        {
            years.add(courses[i].Year)
        }

        res.send( Array.from(years))})
    .catch(err => res.status(400).json('Error:' +err));
});
router.route('/:sid').get((req,res)=>{

enrollCourse.find({userId:req.params.sid},{_id: 0,_v:0})
    .then(courses =>{
        res.json(courses)
   })
    .catch(err => res.status(400).json('Error:' +err));
    });


router.route('/view/:term/:year/:sid').get((req,res)=>{

enrollCourse.find({ Term: req.params.term,Year:req.params.year,userId:req.params.sid})
    .then(courses =>{
        res.json(courses)
   })
    .catch(err => res.status(400).json('Error:' +err));
    });


router.route('/updategrade/:userName/:CRNNO').put((req, res) => {
    enrollCourse.findOneAndUpdate({
        userName: req.params.userName,
        CRNNO: req.params.CRNNO
    }, {grade: req.body.grade}, {new: true, upsert: true, setDefaultsOnInsert: true}, function (error, result) {
        if (error) {
            console.log("Something wrong when updating data!");
        }

        res.send(result)
    });
});



  router.route('/drop/:sid/:crnno').delete((req,res)=> {
      enrollCourse.findOneAndDelete({CRNNO: req.params.crnno,userId:req.params.sid}, function (err) {
          if (err) console.log(err);
          res.send("course dropped")
      });
  });

router.route('/add').post((req,res)=>{

    const courseId =req.body.courseId;
    const CRNNO=req.body.CRNNO;
   const Term=req.body.Term;
  const   Year=req.body.Year;
const   department=req.body.department;
 const   userName=req.body.userName;
const   userId=req.body.userId;
const  grade ="I";
const professorUserName=req.body.professorUserName
const enroll = new enrollCourse({courseId,CRNNO,Term,Year,department,userName,userId,grade,professorUserName });

    enroll.save()
   .then(() => res.json('Course enrolled!'))
   .catch(err => res.status(400).json('Error:' +err))
});




router.route('/update/:userName').post((req, res) => {
  enrollCourse.findOneAndUpdate({"userName":req.params.userName})
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