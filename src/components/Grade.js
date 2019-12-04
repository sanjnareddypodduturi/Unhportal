
import React from 'react'
import {Button} from 'react-mdl';
import axios from 'axios';
import Reactable from "react-table";
import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import $ from 'jquery';
import renderRedirect from "./RenderRedirect";
import {Redirect} from "react-router-dom";

let term=['Summer','Fall','Spring'];
let grades={};
class Grade extends React.Component { 
  constructor(props) {
      super(props);
      this.state = {
         results: [],
         term: ""
      }
      this.processResults = this.processResults.bind(this);
   }

  processResults(deg,students) {
    this.setState({results:students, term:deg}, () => {

      console.log(this.state.results);
    });
  }

  render() {
    return (
      <div>

          {renderRedirect("/facultyLogin","faculty")}
        <h1 align="center">Award Grade for students </h1>
        <GSRequest callbackParent={this.processResults}/>
       <GSResult term={this.state.term} results={this.state.results} />
      </div>
    );
  }
}

class GSRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      department: "",
      term: "",
      year: ""
    }
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(fld,val) {
    var x = {};
    if (fld === "department")
      x["department"] = val;
    else if (fld === "term")
      x["term"] = val;
    else
      x["year"] = val;
    this.setState(x, () => {
      if ((this.state.department !== "") && (this.state.term !== "") && (this.state.year !== "")) {
        var gradurl = "http://localhost:5000/enrollCourses/grade/"+localStorage.getItem("professorUserName")+"/"+this.state.department+"/"+this.state.term+"/"+this.state.year;
    console.log(gradurl)
         $.ajax({
          url: gradurl,
          dataType: 'json',
          cache: false,
          success: function(jsondata) {
            this.props.callbackParent(this.state.term,jsondata);
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
          <td><div style={{width: 200 + 'px'}} >
                <TermPicker
                   callbackParent={this.onInputChange} />
              </div>
          </td>
          <td><div style={{width: 200 + 'px'}} >
                <YearPicker 
                  url="http://localhost:5000/courses/years"
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
    
     constructor(props) {
    super(props);
    this.state = {grade: ''};
    this.handleSubmit = this.handleSubmit.bind(this);

  }

     handleSubmit(evnt) {
         console.log(JSON.parse(localStorage.getItem("updateGrade")))
         for(let key in grades){
             let username=key
             let courseGrade=grades[key]
             for(let g in courseGrade)
             {
                 let apiBaseUrl = "http://localhost:5000/enrollCourses/updategrade/"+username+"/"+g;
      let payload={
          "grade":courseGrade[g]
      }
    axios.put(apiBaseUrl,payload).then(function (response) {
     console.log(response);
   })
   .catch(function (error) {
     console.log(error);
    });
             }
         }

alert("Grade Updated")
         window.location="/facultyDashboard"
  }

   updateInputValue(values,val) {
    console.log(values,val)
       if(JSON.parse(localStorage.getItem("updateGrade")===null))
       {    console.log("null");

           let courseGrades={}
            courseGrades[values.crn]=val.toUpperCase();
       grades[values.userName]=courseGrades;
       localStorage.setItem("updateGrade",JSON.stringify(grades));
 console.log(JSON.parse(localStorage.getItem("updateGrade")))
       }
       else{
            console.log("not-null");
           grades=JSON.parse(localStorage.getItem("updateGrade"));
       let courseGrades=grades[values.userName]
       courseGrades[values.crn]=val.toUpperCase();
       grades[values.userName]=courseGrades
       localStorage.setItem("updateGrade",JSON.stringify(grades));
       }
console.log(grades);
  }
    
  render() {
        var temp=[]

    temp=this.props.results
        const data=[]    
  
    for(let i=0;i<temp.length;i++)
        {
            console.log(temp[i])
  
       data.push({
           sid:temp[i]["userId"],
           grade: temp[i]["grade"],
      term: temp[i]["Term"],
           year:temp[i]["Year"],
           crn:temp[i]["CRNNO"],
           cno:temp[i]["courseId"],
           userName:temp[i]["userName"],
           department:temp[i]["department"],
        
     })
  }
    const cols = [
        
        {
            Header: 'UserId',
            accessor: 'sid',width:150
                },

        {
            Header: 'UserName',
            accessor: 'userName',width:150
                },
        {
            Header: 'Department',
            accessor: 'department',width:150
                },
       
               {
            Header: 'Term',
            accessor: 'term',width:150
        },
         {
            Header: 'Year',
            accessor: 'year',width:150
        },{
            Header: 'CRN',
            accessor: 'crn',width:150
          
        },
        {
            Header: 'Grade',
            accessor: 'grade',width:150
          
        },{
            Header: 'CNO',
            accessor: 'cno',width:150
          
        },{
            Header: 'Submit Grade',
            accessor: 'finalgrade',
              Cell: row => (<div>
            <input type="text"  name="grade" placeholder="Grade-A,B,C,D" onChange={(e)=>this.updateInputValue(row.original,e.target.value)}/>
        </div> )
        
         
        }
    ]

    return (
        (this.props.term === "")?<div></div>: <div><Reactable  data={data} columns={cols}  defaultPageSize = {5}    onFetchData={this.fetch}    /><center><Button onClick={this.handleSubmit} >Submit-Grades</Button></center> {renderRedirect("/facultyLogin","faculty","/facultyDashboard","grade")}</div>
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
        placeholder="Department"
      /> 
    );
  }
}

class TermPicker extends React.Component {
  render() {
    return (
      <DropdownList
        data={term}
        onChange={value => this.props.callbackParent("term",value) }
        placeholder="Term"
      /> 
    );
  }
}

class YearPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: []
    }
  }

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(jsondata) {
        this.setState({years:jsondata});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return (
      <DropdownList
        data={this.state.years}
        onChange={value => this.props.callbackParent("year",value) }
        placeholder="Year"
      /> 
    );
  }
}



export default Grade;