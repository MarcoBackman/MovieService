import '../stylesheet/NavigationBar.css';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {resetCookieConsentValue} from "react-cookie-consent";

/**
 * Navigation feature for the top bar that user can interact for user profile, login, logout.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function NavigationBar(props) {
    let navigate = useNavigate();

    async function deleteCookieSession() {
        await axios.delete('/security/deleteCookie')
            .then(() => {
                resetCookieConsentValue()
            })
            .catch(err => {
                console.error(err);
            });
    }


    async function sessionLogOut() {
        await axios.post('/security/sessionLogout')
            .then((resp) => {
                console.error(resp);
            })
            .catch(err => {
                console.error(err);
            });
    }

    function clickEventHandler(event) {
        if (props.session.status === "Sign In") {
            navigate("/login");
        } else {

            deleteCookieSession();
            sessionLogOut();

            props.setSession({
                login : false,
                status : "Sign In"
            });

            props.setUser({
                name : 'Guest',
                favorite_list : [],
            });

            navigate("/home");
        }
    }

    return (
        <div id="navigation_bar">
            <h1 className="nav_title" onClick={(e) => {navigate("/home");}}>BAEKFLIX</h1>
            <button id="login_button" className="nav_button" onClick={clickEventHandler}>
                {props.session.status}
            </button>

            <label id="user_label" className="nav_label">
                Welcome! {props.user.name}
            </label>
        </div>
    );
}

export default NavigationBar;
