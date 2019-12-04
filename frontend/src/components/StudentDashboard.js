import React from 'react'
import { withRouter } from 'react-router-dom';
import SimpleCard from "./card";
import { Grid } from '@material-ui/core';
import $ from "jquery";
import renderRedirect from "./RenderRedirect";
import ViewGrade from "./ViewGrade";
class StudentDashboard extends React.Component {

    componentDidMount() {


         if(localStorage.getItem('userName')===null)
         {
             localStorage.setItem("redirect",true);
               console.log("redirect");
         }
         else
         {
             localStorage.setItem("redirect",false)
             console.log("stay");

             var userurl = "http://localhost:5000/users/user/"+localStorage.getItem("userName");
             console.log(userurl);
         $.ajax({
          url: userurl,
          dataType: 'json',
          cache: false,
          success: function(jsondata) {
              console.log(jsondata)
              localStorage.setItem("userId",jsondata[0]["userId"])
              localStorage.setItem("department",jsondata[0]["department"])
        var userurl = "http://localhost:5000/courses/department/"+jsondata[0]["department"];
        console.log(userurl)
         $.ajax({
          url: userurl,
          dataType: 'json',
          cache: false,
          success: function(jsondata) {
            console.log(jsondata)
            let courseMap={}
            let professorMap={}
            for(let i =0; i<jsondata.length;i++)
              {

                  courseMap[jsondata[i]["CRNNO"]] =jsondata[i]["CRNNO"]+"-" +jsondata[i]["courseId"]+"-"+jsondata[i]["courseName"]+"-"+jsondata[i]["Professor"]+"-"+jsondata[i]["Days"]+"-"+jsondata[i]["Term"]+"-"+jsondata[i]["Year"];
                    professorMap[jsondata[i]["CRNNO"]] =jsondata[i]["professorUserName"]
              }
              localStorage.setItem("courseMap",JSON.stringify(courseMap));
            localStorage.setItem("professorMap",JSON.stringify(professorMap));
            console.log(professorMap)
          },
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
          },
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });

        }
console.log(localStorage.getItem("courseMap"))
    }

    render() {


    return (
      <div align="center" className="paws-home">
          {renderRedirect("/studentLogin","student")}
          <div className="root">
      <Grid container spacing={3}>
        <Grid item xs={4}>
            <h4 align={"left"}>Student Dashboard</h4>
        </Grid>
        <Grid item xs={4}>
          <h4>Welcome to University Student Portal</h4>
        </Grid>
        <Grid item xs={4}>

        </Grid>

      </Grid>

    </div>
           <Grid container spacing={3} >
               <Grid item xs={2}>
                 </Grid>
               <Grid item xs={3} >
                 <SimpleCard title={"My Registration"} content={" All Semesters "}  description={'Student can add or drop courses from here.'} action1={"Register"}  action2={"Drop"} link1={"/courses"} link2={"/dropcourses"}/>
                </Grid>
                <Grid item xs={3}>
                 <SimpleCard title={"My Grades"} content={"Overall GPA"}  description={'grade'}   link1={"grade"}  />
                 </Grid>
                <Grid item xs={3}>
                 <SimpleCard title={"Course Schedule"} content={" All Semesters "} description={'Student can check schedule.'}  action1={"View Schedule"} link1={"/CourseSchedule"}/>
                </Grid>
               <Grid item xs={2}>
                 </Grid>
           </Grid>



      </div>
    )
  }
}

export default withRouter((StudentDashboard))
