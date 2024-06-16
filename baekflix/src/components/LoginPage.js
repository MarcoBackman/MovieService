import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

// Application Specific Imports
import {login, fetchAndSetUserFavorite} from '../service/UserService';
import UserContext from "../context/UserContext";
import SessionContext from "../context/SessionContext";

//Styles
import '../stylesheet/LoginPage.css';

function LoginPage(props) {

    const navigate = useNavigate();
    const [saveStatus, setSaveStatus] = useState("User Login");
    const {user, setUser} = useContext(UserContext);
    const {session, setSession} = useContext(SessionContext);

    useEffect(() => {
        alert("Account registration is currently blocked due to security reason.\n Only predefined id/pw are accepted");
    }, []);

    async function getLoginsOnForm() {
        let id = document.querySelector("#id_input").value;
        let pw = document.querySelector("#pw_input").value;

        return {
            'id': id,
            'pw': pw,
        };
    }

    async function handleSubmit(form) {
        let loginSuccess = await login(form, setSession, setUser);
        if (loginSuccess === false ) {
            return false;
        } else {
            await fetchAndSetUserFavorite(form.id, setUser);
            //Redirect to main
            return true;
        }
    }

    async function loginEvent(event) {
        event.preventDefault();
        if (saveStatus === "Processing...") {
            alert("Still on process");
            return;
        }

        let form = await getLoginsOnForm();
        let loginSuccess = await handleSubmit(form);
        if (loginSuccess === true) {
            setSaveStatus("User Login");
            navigate("/home");
        }
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
