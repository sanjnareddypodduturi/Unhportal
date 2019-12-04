import React from 'react'
import Reactable from "react-table";
import "react-table/react-table.css";
import DropdownList from 'react-widgets/lib/DropdownList';
import 'react-widgets/dist/css/react-widgets.css';
import $ from 'jquery';
import renderRedirect from "./RenderRedirect";


class GetEnrollments extends React.Component {
    constructor(props) {
    super(props);
     this.state = {results:[],dept:''}
     this.processResults = this.processResults.bind(this);
   }
   processResults(courses,temp) {
      this.setState({results:courses, dept:temp}, () => {
        console.log(this.state.dept);
      });


   }
   render() {
    return (
      <div>
  {renderRedirect("/facultyLogin","faculty")}
        <h1 align="center">Enrollments List</h1>
        <GSRequest callbackParent={this.processResults}/> <br/>
        <GSResult results={this.state.results} />
      </div>
    );
  }
}

class GSRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      department: ""
    }
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(fld,val) {
    var x = {};
    if (fld === "department")
      x["department"] = val;
    this.setState(x, () => {
      if ((this.state.department !== "")) {
        var gradurl = "http://localhost:5000/enrollCourses/enrollments/professor/"+this.state.department+"/"+localStorage.getItem("professorUserName");
        console.log(gradurl)
         $.ajax({
          url: gradurl,
          dataType: 'json',
          cache: false,
          success: function(jsondata) {
            this.props.callbackParent(jsondata,this.state.department);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
          
      }
    });
    }
    
  render() {
      
    return (
        <center>
      <table>
        <tbody>
        <tr>
          <td><div style={{width: 200 + 'px'}} >
                <DepartmentPicker 
                   url="http://localhost:5000/courses/departments"
                   callbackParent={this.onInputChange}
                   pollInterval={200000} />
              </div>
          </td>
        </tr>
        </tbody>
      </table>
        </center>
       
    );
  }
}

class GSResult extends React.Component {

  render() {
         var temp=[]
        temp=this.props.results

        const data=[]  
        for(let i=0;i<temp.length;i++)
        { console.log(temp[i])
            data.push({ sid: temp[i]["userId"],term: temp[i]["Term"],year: temp[i]["Year"],crn: temp[i]["CRNNO"],cno: temp[i]["courseId"]})
        }

    const columns = [
        {
            Header: 'Student ID',
            accessor: 'sid'
        },
        {
            Header: 'Term',
            accessor: 'term'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },
        {
            Header: 'CRN',
            accessor: 'crn'
        },
        {
            Header: 'CNO',
            accessor: 'cno'
        },

    ]                                                                   
    return (
      (this.props.dept === "")?<div></div>: <Reactable  data={data} columns={columns}  defaultPageSize = {5} />
     );

    }
}

class DepartmentPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: []
    }
  }

  componentDidMount() {

      fetch(this.props.url)
      .then(res => res.json())
      .then(
        (jsondata) => {
          this.setState({departments: jsondata});
       },
        (error) => {
          console.error(this.props.url, error.toString());
        }
          
      )
  }

  render() {
    return (
      <DropdownList
        data={this.state.departments}
        onChange={value => this.props.callbackParent("department",value) }
        placeholder="Department"/> 
    );
  }
}



export default GetEnrollments;