import React from 'react'
import { withRouter } from 'react-router-dom'
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios'
import renderRedirect from "./RenderRedirect";
class CourseSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = 
        {
         term: '',
         year: '',
         crn: '',
         dept: '',
         cno: '',
         section: '',
         days: '',
         stime: '',
         etime: '',
         room: '',
         cap: '',
         instructor: '',
         auth: '',
         cname: '',
         credit: '',
         row:'',course:[]
        }
     
  }

componentDidMount() {
    var apiBaseUrl = "http://localhost:5000/enrollCourses/"+localStorage.getItem("userId");
    var self = this;
    axios.get(apiBaseUrl).then(function (response) {
               
        self.setState({  

            course:response.data
          })
    
    })     
    .catch(function (error) {
      console.log(error);
    });
}


render() {

    var temp=[]
    temp=this.state.course
   console.log(temp)
         const data=[]   
         
    for(let i=0;i<temp.length;i++)
        {
        let courseMap =JSON.parse(localStorage.getItem("courseMap"))
            let courseList=courseMap[temp[i]["CRNNO"]].split("-")
            console.log(courseList)
        
       data.push({
      term: temp[i]["Term"],
      year: temp[i]["Year"],
      crn: temp[i]["CRNNO"],
      cno: temp[i]["courseId"],
      cname: courseList[2],
      days: courseList[4],
      ins: courseList[3]
     })
  }
console.log(data)
    const columns = [
         {
            Header: 'Course Name',
            accessor: 'cname',
            width:250
        },
         {
            Header: 'Instructor',
            accessor: 'ins'
        },

        {
            Header: 'CRN',
            accessor: 'crn'
        },
        {
            Header: 'CourseId',
            accessor: 'cno'
        },


        {
            Header: 'Days',
            accessor: 'days'
        },
         {
            Header: 'Term',
            accessor: 'term'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },


    ]

    return (
        
          <div width='400px'>
 {renderRedirect("/studentLogin","student")}
        <h3 align="center">Course Schedule</h3>
              <ReactTable
                data={data}
                columns={columns}
                defaultPageSize = {10}
              />
          </div>  
        
    )
  }
}

export default withRouter(CourseSchedule)


