import React, { Component } from 'react';
import './App.css';
import {Layout, Header, Navigation,  Content} from 'react-mdl';
import Main from './components/main';
import { Link } from 'react-router-dom';
import {  IoMdHome } from 'react-icons/io';

class App extends Component {
constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
}
  logout(event) {
    localStorage.clear();
  }
  render() {
let link1,link2,link3;
//console.log(localStorage.getItem("student"),localStorage.getItem("faculty"),localStorage.getItem("userName"))
if(localStorage.getItem("userName")== null && localStorage.getItem("professorUserName")== null )
{
link1=<Link to="/studentLogin">Student</Link>
    link2= <Link to="/facultyLogin">Faculty</Link>
}
else if(localStorage.getItem("professorUserName")!== null){
    link3=<h4>  <strong> {localStorage.getItem("professorUserName")}</strong>  <Link to="/" onClick={this.logout}>Logout</Link></h4>
}
else if(localStorage.getItem("userName")!== null){
    link3=<h4>  <strong> {localStorage.getItem("userName")}</strong>  <Link to="/" onClick={this.logout}>Logout</Link></h4>
}
    return (
        <div className="demo-big-content">

            <Layout>
                <Header className="header-color" title={<span><span style={{ color: '#7dd' }}><Link to='/'><IoMdHome size='25' color ="white"/></Link></span><strong>   University Portal</strong></span>}>
                    <Navigation>
                        {link1}{link2}{link3}

                    </Navigation>
                </Header>
                
                <Content>
                    <Main />
                </Content>
            </Layout>
        </div> 
    );
  }
}

export default App;