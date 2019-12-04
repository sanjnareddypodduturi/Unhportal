import React, { Component } from 'react';
import MultiSelectBox from 'react-multiselect-box';
import 'react-multiselect-box/build/css/index.css';
import axios from 'axios'
import { Redirect} from 'react-router-dom'
import {Button} from 'react-mdl';
import 'react-widgets/dist/css/react-widgets.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import $ from 'jquery';
import renderRedirect from "./RenderRedirect";

var term=['Summer','Fall','Spring'];

let dropoptions=[];

class AddDropCourses extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
        selectedList: [],
        courses:[],
        sid:"",
        year:"",
        term:"",options:""
    }
    this.processResults = this.processResults.bind(this);
  }
  processResults(sid,stats,term,year) {
    this.setState({courses:stats, sid:sid,term:term,year:year[0],options: []}, () => {

    });

    var allcourses=[]
      dropoptions=[]
      console.log(this.state.courses)
    allcourses=this.state.courses
      var courseMap={}
      courseMap=JSON.parse(localStorage.getItem("courseMap"))
      console.log(courseMap);
     if(allcourses===null)
     {
         allcourses=[]
     }
    for(let i=0;i<allcourses.length;i++)
    {console.log(allcourses[i]);
      dropoptions.push({
        desc: courseMap[allcourses[i]["CRNNO"]],
          value: allcourses[i]["CRNNO"]
         })
    }
    console.log(dropoptions);
       this.setState({options:dropoptions});
     this.forceUpdate();
  }

  render() {
    return (
      <div>

        
        <h1 align="center">Drop Courses</h1>
            {renderRedirect("/studentLogin","student","/studentDashboard","dropped")}
        <GSRequest callbackParent={this.processResults} dept="CSC" sid={localStorage.getItem("userId")} />
       <GSResult term={this.state.term} year={this.state.year} sid={localStorage.getItem("userId")}  courses={this.state.results} options={this.state.options}  />
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
    var x = {};
    if (fld === "term")
      x["term"] = val;
    else
      x["year"] = val;
      
    this.setState(x, () => {
      if ((this.state.term !== "") && (this.state.year !== "")) {
          
        var gradurl = "http://localhost:5000/enrollCourses/view/"+this.state.term+"/"+this.state.year+"/"+this.props.sid;
          console.log(gradurl);
         $.ajax({
          url: gradurl,
          dataType: 'json',
          cache: false,
          success: function(jsondata) {
            console.log(jsondata)
            this.props.callbackParent(this.props.sid,jsondata,this.state.term,this.state.year);
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
   saveList(values,val){
       
    var apiBaseUrl = "http://localhost:5000/enrollCourses";
    var self = this;
       

   for(let i=0;i<values.selectedList.length;i++)
        {
           
        let c=values.selectedList[i];

            let courseList=JSON.parse(localStorage.getItem("courseMap"))
            courseList=courseList[c].split("-")
            console.log(courseList)

      axios.delete(apiBaseUrl+'/drop/'+self.props.sid+'/'+courseList[0]).then(function (response) {
      console.log(response);

   })
   .catch(function (error) {
     console.log(error);
    });

        }
   localStorage.setItem("dropped", true);
      self.setState({
              selectedList: []
            })
       alert("Courses dropped successfully");

    }

    render(){
    const {  selectedList } = this.state

    return (
      <div className="container">
{renderRedirect("/studentLogin","student","/studentDashboard","dropped")}

        <MultiSelectBox
          options={dropoptions}
          labelKey="desc"
          valueKey="value"
          valueArray={selectedList}
          onAdd={selectedItem => {
            this.setState({
              selectedList: [...this.state.selectedList, selectedItem.value]
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
        <h1 align="center"><Button onClick= {value=>this.saveList({selectedList:this.state.selectedList},value)}>Save</Button></h1>
            
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