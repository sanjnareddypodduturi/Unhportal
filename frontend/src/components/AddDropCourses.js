import React, { Component } from 'react';
import MultiSelectBox from 'react-multiselect-box';
import 'react-multiselect-box/build/css/index.css';
import axios from 'axios' 
import { Redirect} from 'react-router-dom'
import {Button} from 'react-mdl';
import 'react-widgets/dist/css/react-widgets.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import $ from 'jquery';
import {Grid} from "@material-ui/core";
import renderRedirect from "./RenderRedirect";


let term=['Summer','Fall','Spring'];

let options=[];

class AddDropCourses extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
        selectedList: [],
        courses:[],
        term:"",
        year:"",
        dept:"",options:""
    }
    this.processResults = this.processResults.bind(this);
  }

    processResults(tm,yr,stats) {
    this.setState({courses:stats, term:tm,year:yr}, () => {
      
    });
 let courseUrl = "http://localhost:5000/enrollCourses/view/"+this.state.term+"/"+this.state.year+"/"+localStorage.getItem("userId");
console.log(this.state.courses)
          axios.get(courseUrl).then(function (response) {
         let  uniqueCRN=new Set();

              for(let i=0;i<response.data.length;i++)
              {
                  uniqueCRN.add(response.data[i]["CRNNO"])
              }
console.log(uniqueCRN)
              localStorage.setItem("enrolledCrns",JSON.stringify(Array.from(uniqueCRN)))
               })
    .catch(function (error) {
      console.log(error);
    });
    options=[]
    let allcourses=[]
        let enrolledCrns=[]
        enrolledCrns=JSON.parse(localStorage.getItem("enrolledCrns"))
console.log(enrolledCrns)
    allcourses=this.state.courses
console.log(enrolledCrns,allcourses)
         for (let i = 0; i < allcourses.length; i++)
            {  if(enrolledCrns!==null  && enrolledCrns.length > 0) 
              {
                  if(enrolledCrns.indexOf(allcourses[i]["CRNNO"])===-1)
                    {
                          console.log(allcourses[i]["CRNNO"], enrolledCrns)
                            options.push({
                                desc: allcourses[i]["courseId"] + " " + allcourses[i]["courseName"] + " " + allcourses[i]["Professor"] + " " + allcourses[i]["Days"],
                                value: allcourses[i]["CRNNO"] + "" + allcourses[i]["courseId"]
                            })
                    }
                  }
                
                else{
                  options.push({
                    desc: allcourses[i]["courseId"] + " " + allcourses[i]["courseName"] + " " + allcourses[i]["Professor"] + " " + allcourses[i]["Days"],
                    value: allcourses[i]["CRNNO"] + "" + allcourses[i]["courseId"]
                })
                }
                 
        }
      this.setState({options:options});
      this.forceUpdate();
  }

  render() {
    return (
 <div>
           <div className="root">
      <Grid container spacing={3}>
        <Grid item xs={4}>

        </Grid>
        <Grid item xs={4}>
          <h4>Add Courses</h4>
        </Grid>
        <Grid item xs={4}>

        </Grid>

      </Grid>

    </div>

       <table>
        <tr ><td>
        </td>
        <td width="1500px"></td></tr> </table>
        

        <GSRequest callbackParent={this.processResults} dept="CSC"  />
       <GSResult term={this.state.term} year={this.state.year}  courses={this.state.results} options={this.state.options} />
      </div>
    );
  }
}
class GSRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      year: ""
    }
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(fld,val) {
    let x = {};
    if (fld === "term")
      x["term"] = val;
    else
      x["year"] = val;
      
    this.setState(x, () => {
      if ((this.state.term !== "") && (this.state.year !== "")) {



        let gradurl = "http://localhost:5000/courses/CSC/"+this.state.term+"/"+this.state.year;
          console.log(gradurl);
         $.ajax({
          url: gradurl,
          dataType: 'json',
          cache: false,
          success: function(jsondata) {
            this.props.callbackParent(this.state.term,this.state.year,jsondata);
            console.log(jsondata)
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
    super(props)

    this.state = {
        selectedList: []
    }
   }
   saveList(values,val) {
       console.log(values, val)
       let apiBaseUrl = "http://localhost:5000/enrollCourses/add";
       let self = this;
       let professorMap=JSON.parse(localStorage.getItem("professorMap"));
       console.log(professorMap)
       for (let i = 0; i < values.selectedList.length; i++) {

           let c = values.selectedList[i];
           let payload = {
               "CRNNO": c.substring(0, 5),
               "Term": self.props.term,
               "Year": self.props.year,
               "grade": "I",
               "userId": localStorage.getItem("userId"),
               "courseId": c.substring(5, 9),
               "department": "CSC",
               "userName": localStorage.getItem("userName"),
               "professorUserName":professorMap[c.substring(0, 5)]

           }

           console.log(payload,apiBaseUrl)
           axios.post(apiBaseUrl, payload).then(function (response) {
          console.log(response)
               if (response.status === 200) {
                   if (response.data.status) {
                       console.log(response.data)


                   }
               }

           })
               .catch(function (error) {
                   console.log(error);
               });

       }

                 localStorage.setItem("added", true);
        self.setState({
              selectedList: []
            })
       alert("Courses added successfully")
   }



    render(){
    const {  selectedList } = this.state
    return (
      <div className="container">
         {renderRedirect("/studentLogin","student","/studentDashboard","added")}

        <MultiSelectBox
          options={options}
          labelKey="desc"
          valueKey="value"
          valueArray={selectedList}
          onAdd={selectedItem => {
            this.setState({
              selectedList: [...this.state.selectedList, selectedItem.value],

            })
          }}
          onRemove={(removedItem, index) => {

            this.setState({
              selectedList: [
                ...this.state.selectedList.filter(
                  item => item !== removedItem.value
                )
              ]
            })
          }}
          onSelectAll={selectedItems => {
            this.setState({
              selectedList: [
                ...this.state.selectedList,
                ...selectedItems.map(item => item.value)
              ]
                       
            })
          }}
          onRemoveAll={() =>
            this.setState({
              selectedList: []
            })
          }
        />
        <br /> 
        <h1 align="center"><Button color="primary" onClick= {value=>this.saveList({selectedList:this.state.selectedList},options)}>Save</Button></h1>
      </div>
    )
  }
}

    
   
    
    
class TermPicker extends React.Component {
  render() {
    return (
      <DropdownList
        data={term}
        onChange={value => this.props.callbackParent("term",value) }
        placeholder="Term"/> 
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
        placeholder="Year"/> 
    );
  }
}


export default AddDropCourses