
import React from 'react';
import axios from 'axios';
import {Textfield,Button} from 'react-mdl';
import {  MdEmail,MdLock } from 'react-icons/md';
import renderRedirect from "./RenderRedirect";


class FacultyLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userName: '', password: ''};

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange1(event) {
    this.setState({userName: event.target.value});
  }

  handleChange2(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.userName.length > 6 && this.state.password.length > 6) {
      var apiBaseUrl = "http://localhost:5000/professor";
      var self = this;
      var payload = {
        "professorUserName": this.state.userName,
        "password": this.state.password
      }
      console.log(payload);
      axios.post(apiBaseUrl + "/authentication", payload).then(function (response) {
        console.log(response)
        if (response.data.status === 200) {
          localStorage.setItem('faculty', true);
          localStorage.setItem('professorUserName', self.state.userName);
          console.log(localStorage.getItem("professorUserName"));
          self.props.history.push({
            pathname: '/facultyDashboard'
          });

        } else {
          alert("Invalid credentials");
          self.props.history.push({
            pathname: '/facultyLogin'
          });
        }

      })

          .catch(function (error) {
            console.log(error);
            alert("Invalid credentials");
          });
      event.preventDefault();
    }
     else
        {

            alert("Invalid credentials");
        }

  }

  render() {
    return (
      <div className="bg-color">
    {renderRedirect("/facultyLogin","faculty")}
        <center>
                  <br/>
        <h4>Faculty Login</h4>
        <form  onSubmit={this.handleSubmit}>
        <table>
          <tr>
          <td><MdEmail  size='30'/></td>
          <td><Textfield
                onChange={this.handleChange1}
                label="userName"
        error={this.state.error1}
                errorColor={'red'}
                onFocus={() => this.setState({error1: "userName can't be blank"})}
              pattern={this.state.userName.length>0}
                style={{width: '200px'}}/></td>
          </tr>
          <tr>
          <td><MdLock  size='35'/></td>
          <td><Textfield
                 onChange={this.handleChange2}                 
                 label="Password"
                type="password"
            error={this.state.error2}
                errorColor={'red'}
                onFocus={() => this.setState({error2: "Password can't be blank"})}
              pattern={this.state.password.length>0}
                style={{width: '200px'}}/></td>
          </tr>
          <tr><td/>
     <td ><Button value="submit">Login</Button></td>
          </tr>
       
        </table>
        
       
        </form>
        </center>
      </div>
    )
  }
}




export default FacultyLogin;