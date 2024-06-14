import axios from "axios";
import {resetCookieConsentValue} from "react-cookie-consent";

//Set session when user logs in
export const setSessionRequest = async function (userID) {
    await axios.post('/security/postSession', {user : userID})
        .catch(err => {
            console.error(err);
        });
}

export const sessionLogOut = async function () {
    await axios.post('/security/sessionLogout')
        .then((resp) => {
            console.error(resp);
        })
        .catch(err => {
            console.error(err);
        });
}

export const deleteCookieSession = async function() {
    await axios.delete('/security/deleteCookie')
        .then(() => {
            resetCookieConsentValue()
        })
        .catch(err => {
            console.error(err);
        });
}

export const setCookieSession = async function(userId) {
    const form = {
        "user": userId,
    };

    try {
        const resp = await axios.post('/security/setCookie', form);
        console.log("Cookie response: ", resp);
    } catch (err) {
        console.error("Cookie request Error: ", err);
    }
}

/**
 * SessionId will be contained in the browser cookie if once retrieved.
 * Therefore, no need to send sessionId directly.
 * @returns
 * "sessionData": {
 *         "_id": uuid,
 *         "id": String,
 *         "email": String,
 *         "likedMovies": Array<String>,
 *         "salt": String,
 *         "hash": String,
 *         "__v": number
 *     },
 * "cookie": {
 *         "originalMaxAge": 900000,
 *         "expires": "2024-06-13T19:54:25.870Z",
 *         "secure": false,
 *         "httpOnly": true,
 *         "path": "/"
 *     }
 */
export const getSession = async function() {
    return await axios.get('/security/getSession');
}