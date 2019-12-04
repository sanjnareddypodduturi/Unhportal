import {Redirect} from "react-router-dom";
import React from "react";

export default function renderRedirect(path1,key1,path2,key2) {

    if(key1==="faculty") {
        console.log(localStorage.getItem("professorUserName"))
        if (localStorage.getItem("professorUserName") === null) {

            return <Redirect to={path1}/>
        } else if({path1}==="/facultyLogin") {
            return <Redirect to="facultyDashboard"/>
        }

        if (localStorage.getItem(key2) === "true") {
            localStorage.setItem(key2, false)
            return <Redirect to={path2}/>
        }
    }

    else if(key1==="student") {
         console.log(localStorage.getItem("userName"))
         if (localStorage.getItem("userName") === null) {

            return <Redirect to={path1}/>
         }
    else if({path1}==="/studentLogin") {
            return <Redirect to="studentDashboard"/>
        }


        if (localStorage.getItem(key2) === "true") {
            localStorage.setItem(key2, false)
            return <Redirect to={path2}/>
        }

    }


}