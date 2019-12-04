
import React from "react";
import axios from "axios";



export default function calulateGrade(userID) {
let courseList=[]
 let grade={"A":4.0,"B":3.7,"C":3.4,"D":3.0}
    let gpa=0.0
 let url = "http://localhost:5000/enrollCourses/"+localStorage.getItem("userId")
          console.log(url);
        axios.get(url).then(function (response) {
            courseList=response.data
    console.log(courseList)
            let count=0
     for (let i=0;i<courseList.length;courseList++)
       {
           if(courseList[i]["grade"]!=="I")
           {
            gpa+=grade[courseList[i]["grade"]]
               
           }
           count+=1
       }
       console.log(gpa,count)

       gpa = gpa/count
       
       console.log(gpa)
       localStorage.setItem("grade",gpa)
    })
    .catch(function (error) {
      console.log(error);
    });


return localStorage.getItem("grade")
}