import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CookieConsent, { resetCookieConsentValue } from 'react-cookie-consent';
import React, {useState, useEffect, useRef} from 'react';

// Application Specific Imports
import UserContext from './UserContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import MovieListPage from './MovieListPage';
import axios from 'axios';

// Styles
import '../stylesheet/App.css';

async function setCookieSession(name) {
    const form = {
        "user": name,
    };

    try {
        const resp = await axios.post('/security/setCookie', form);
        console.log("Cookie response: ", resp);
    } catch (err) {
        console.error("Cookie request Error: ", err);
    }
}

function App() {
    //Important proxy setting


    const [user, setUser] = useState({ name: 'Guest', favorite_list: [] });
    const [session, setSession] = useState({ login: false, status: "Sign In" });
    const previousLoginState = useRef(session.login);

    useEffect(() => {
        initializeWebPage().then(() => console.log("Initialization for hook completed."));
    }, []);

    useEffect(() => {
        if (previousLoginState.current === true && session.login === false) {
            alert("You have been logged out");
        }
        previousLoginState.current = session.login;
    }, [session.login]);

    // If session is still valid, do not logout the user
    async function initializeWebPage() {
        try {
            const resp = await axios.get('/security/getSession');

            if (!resp.data || !resp.data.username) {
                resetCookieConsentValue();
                setUser({
                    name: "Guest",
                    favorite_list: []
                });
            } else {
                setUser({
                    name: resp.data.username,
                    favorite_list: [] //keeping it empty as you haven't fetched favorite_list yet
                });

                setSession({
                    login: true,
                    status: "Sign Out"
                });

                // Consider moving the axios.post call here, so it will only run when there's a successful login
                const response = await axios.get(`/user/favorite/${resp.data.username}`);
                if (response.data) {
                    setUser({
                        name: resp.data.username,
                        favorite_list: response.data
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="App">
            <UserContext.Provider value={user}>
                <Router>
                    <Routes>
                        <Route path="*" element={ <MovieListPage user={user} setUser={setUser} session={session} setSession={setSession} /> } />
                        <Route path="/home" element={ <MovieListPage user={user} setUser={setUser} session={session} setSession={setSession} /> }/>
                        <Route path="/login" element={ <LoginPage user={user} setUser={setUser} session={session} setSession={setSession} /> }/>
                        <Route path="/register" element={ <RegisterPage /> }/>
                    </Routes>
                </Router>
                <CookieConsent
                    onAccept={() => { setCookieSession(user.name); }}
                    onDecline={() => { alert("Cookie Declined"); }}
                    enableDeclineButton
                >
                    This website uses cookies to enhance the user experience.
                </CookieConsent>
            </UserContext.Provider>
        </div>
    );
}

export default App;