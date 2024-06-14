import {useContext} from "react";
import {useNavigate} from "react-router-dom";

// Application Specific Imports
import {sessionLogOut, deleteCookieSession} from '../service/SessionService';
import UserContext from "../context/UserContext";
import SessionContext from "../context/SessionContext";

//Styles
import '../stylesheet/NavigationBar.css';

/**
 * Navigation feature for the top bar that user can interact for user profile, login, logout.
 * @returns {JSX.Element}
 * @constructor
 */
function NavigationBar() {
    let navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const {session, setSession} = useContext(SessionContext);

    async function loginBtnClickEventHandler() {
        //When user is logged out, navigate to the login page
        if (session.login === false) {
            navigate("/login");
        } else {

            //When user is logged out, dump session and reset the user context
            //This has to be called first before setting the session. Otherwise, react useEffect will fail.
            await deleteCookieSession();

            setSession({
                login : false,
                status : "Sign In"
            });

            setUser({
                name : 'Guest',
                favorite_map : new Map(),
            });

            navigate("/home");
        }

    }

    return (
        <div id="navigation_bar">
            <h1 className="nav_title" onClick={(e) => {navigate("/home");}}>BAEKFLIX</h1>
            <button id="login_button" className="nav_button" onClick={loginBtnClickEventHandler}>
                {session.status}
            </button>

            <label id="user_label" className="nav_label">
                Welcome! {user.name}
            </label>
        </div>
    );
}

export default NavigationBar;
