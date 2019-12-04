import React from 'react'

import Reactable from "react-table";
import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import $ from 'jquery';
import renderRedirect from "./RenderRedirect";


 
class GetCourses extends React.Component {
    constructor(props) {
    super(props);
    this.state = {results:[]}
    this.processResults = this.processResults.bind(this);
   }
    processResults(courses) {
      this.setState({results:courses}, () => {
        console.log(this.state.results);
      });

   }
   render() {
    return (
      <div>

        <h1 align="center">Courses List</h1>
           {renderRedirect("/facultyLogin","faculty")}
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
        var gradurl = "http://localhost:5000/courses/department/"+this.state.department;
         $.ajax({
          url: gradurl,
          dataType: 'json',
          cache: false,
          success: function(jsondata) {
            this.props.callbackParent(jsondata);
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
        {console.log(temp[i])
            data.push({ crnno: temp[i]["CRNNO"],cname: temp[i]["courseName"],cno: temp[i]["courseId"],day: temp[i]["Days"],professor:temp[i]["Professor"],term:temp[i]["Term"],year:temp[i]["Year"]})
        }

    const columns = [
        {
            Header: 'CRNNO',
            accessor: 'crnno'
        },
        {
            Header: 'Course Name',
            accessor: 'cname'
        },
        {
            Header: 'CNO',
            accessor: 'cno'
        },
        {
            Header: 'Professor',
            accessor: 'professor'
        },
        {
            Header: 'Days',
            accessor: 'day'
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

export default GetCourses;