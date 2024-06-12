import '../stylesheet/LoginPage.css';

import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

function LoginPage(props) {

    const navigate = useNavigate();

    const [saveStatus, setSaveStatus] = useState("User Login");

    async function getLoginsOnForm() {
        let id = document.querySelector("#id_input").value;
        let pw = document.querySelector("#pw_input").value;

        return {
            'id': id,
            'pw': pw,
        };
    }

    //Set session when user logs in
    function setSession(userID) {
        axios.post('/security/postSession', {user : userID})
            .then(resp => {
                console.log(resp);
            })
            .catch(err => {
                console.error(err);
            });
    }

    async function handleSubmit(form) {
        await axios.post('/user/login', form)
            .then(resp => {
                console.log(resp);
                if (resp.data === false) {
                    alert("Login failed wrong ID/PW");
                } else {
                    //Create and set session
                    props.setSession({
                        login : true,
                        status : "Sign out"
                    });

                    //Change user state
                    props.setUser({
                        name : form.id,
                        favorite_list : resp.data,
                        recent_watch_list : []
                    });

                    alert("Logged in success");

                    //Redirect to main
                    navigate("/home")
                }
            })
            .catch(err => {
                console.error(err);
                alert("Failed request: Server Error");
            });
        setSession(form.id);
    }

    async function loginEvent(event) {
        event.preventDefault();
        if (saveStatus === "Processing...") {
            alert("Still on process");
            return;
        }

        let form = await getLoginsOnForm();
        await handleSubmit(form);
        setSaveStatus("User Login");
    }


    return (
        <div id="login_page">
            <div id="navigation_bar">
                <h1 className="nav_title" onClick={(e) => {navigate("/home");}}>BAEKFLIX</h1>
            </div>
            <form id="submit_login" action="/user/login"  method="post"/>
            <div className="input_panel">
                <h2>Sign in</h2>
                <div className="input_form">
                    <label className="login_label">
                        User ID
                        <input id="id_input" className="login_input"/>
                    </label>
                    <label className="login_label">
                        User Password
                        <input id="pw_input" className="login_input" type="password"/>
                    </label>
                </div>
                <div className="button_section">
                    <button id="submit_login_btn" className="login_page_btn" type="submit" form="submit_login" onClick={loginEvent}>
                        {saveStatus}
                    </button>
                    <label>Not registered?</label>
                    <button id="find_id_btn" className="login_page_btn" onClick={(e) => {navigate("/register");}}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
