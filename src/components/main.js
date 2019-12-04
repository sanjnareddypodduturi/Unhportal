import React from 'react';
import { Switch, Route } from 'react-router-dom';


import Home from './Home';
import studentLogin from './studentLogin';
import FacultyLogin from './facultyLogin';

import StudentDashboard from './StudentDashboard';

import AddDropCourses from './AddDropCourses';
import CourseSchedule from './CourseSchedule';
import DropCourses from './DropCourses';
import GetCourses from './GetCourses';
import GetEnrollments from './GetEnrollments';
import GetStudents from './GetStudents';
import FacultyDashboard from './facultyDashboard';
import Grade from './Grade';


const Main = () => (
    <Switch>
        <Route exact path = "/" component = {Home} />
        <Route path = "/studentLogin" component = {studentLogin} />
        <Route path = "/facultyLogin" component = {FacultyLogin} />
    <Route path = "/courses" component = {AddDropCourses} />
    <Route path = "/facultyDashboard" component = {FacultyDashboard} />
    <Route path ="/CourseSchedule"    component={CourseSchedule}/>
    <Route path="/studentDashboard" component={StudentDashboard} />
    <Route path="/getcourses" component={GetCourses} /> 
        <Route path = "/getenrollments" component = {GetEnrollments} />
     <Route path = "/getstudents" component = {GetStudents} />
    <Route path = "/grade" component = {Grade} />
        <Route path="/dropcourses" component={DropCourses} />
      </Switch>
   
)

export default Main;