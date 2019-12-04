import React from 'react'
import { withRouter } from 'react-router-dom'
import {Grid} from "@material-ui/core";
import SimpleCard from "./card";
import renderRedirect from "./RenderRedirect";
class FacultyDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }
  componentDidMount() {

  }

    render() {
    return (
      <div className="candy">
           {renderRedirect("/facultyLogin","faculty")}
    <br/> <center>
          <h3>Faculty Portal</h3>
            <Grid container spacing={3}>

               <Grid item xs={3}>
                 <SimpleCard title={"Student List"} content={"Department Wise"}  description={'Faculty can check student from here.'} action1={"Show Students"}  link1={"/getstudents"} />
        </Grid>
                <Grid item xs={3}>
                 <SimpleCard title={"Course List"} content={"Department wise courses"}  description={'Faculty can check Department wise courses here.'}  action1={"View Courses"} link1={"/getcourses"} />
        </Grid>
                <Grid item xs={3}>
                 <SimpleCard title={"Student Enrollments"} content={"Student Enrollments"} description={'Faculty can check all Student Enrollments.'}  action1={"View Enrollments"} link1={"/getenrollments"}/>
                </Grid>

                <Grid item xs={3}>
                 <SimpleCard title={"Award Grades"} content={" GPA"}  description={'Faculty can award GPA here.'}  action1={"submit Grade"} link1={"/grade"} />

    </Grid>

           </Grid>

</center>
      </div>
    )
  }
}

export default withRouter(FacultyDashboard)
