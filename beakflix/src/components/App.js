import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CookieConsent, { resetCookieConsentValue } from 'react-cookie-consent';
import React, {useState, useEffect, useRef} from 'react';

// Application Specific Imports
import UserContext from '../context/UserContext';
import SessionContext from '../context/SessionContext'
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import MovieListPage from './MovieListPage';
import {getSession, setCookieSession} from '../service/SessionService';
import {fetchAndSetUserFavorite} from '../service/UserService';

// Styles
import '../stylesheet/App.css';

function App() {
    const [user, setUser] = useState({ name: 'Guest', favorite_map: new Map()});
    const [session, setSession] = useState({ login: false, status: "Sign In" });
    const previousLoginState = useRef(session.login);

    useEffect(() => {
        initializeWebPage()
            .then(() => console.log("Initialization for hook in App.js completed."));
    }, []);

    useEffect(() => {
        if (previousLoginState.current === true && session.login === false) {
            alert("You have been logged out");
        }
        previousLoginState.current = session.login;
    }, [session.login]);

    // If session is still valid, do not logout the user
    async function initializeWebPage() {
        let resp = await getSession();
        //When session is over
        //Todo: change this to interact with session data.
        if (previousLoginState.current === false) {
            console.log("Session expired. Resetting attributes to default.")
            resetCookieConsentValue();
            setSession({
                login : false,
                status : "Sign In"
            });

            setUser({
                name : 'Guest',
                favorite_map : new Map(),
            });
        } else { //When session is still valid - load context data
            //Todo: Make sure that server side session returns user data.
            console.log("Session Data", resp.data, user.name);

            user.favorite_map = fetchAndSetUserFavorite(user.name, setUser);

            setSession({
                login: true,
                status: "Sign Out"
            });
        }
    }

    return (
        <div className="App">
            <SessionContext.Provider value={{session, setSession}}>
                <UserContext.Provider value={{user, setUser}}>
                    <Router>
                        <Routes>
                            <Route path="*" element={ <MovieListPage/> } />
                            <Route path="/home" element={ <MovieListPage /> }/>
                            <Route path="/login" element={ <LoginPage /> }/>
                            <Route path="/register" element={ <RegisterPage /> }/>
                        </Routes>
                    </Router>
                    <CookieConsent
                        onAccept={() => { setCookieSession(user.name); }}
                        onDecline={() => { alert("Cookie Declined"); }} //Todo: use local session storage, or JWT
                        enableDeclineButton
                    >
                        This website uses cookies to enhance the user experience.
                    </CookieConsent>
                </UserContext.Provider>
            </SessionContext.Provider>
        </div>
    );
}

export default App;