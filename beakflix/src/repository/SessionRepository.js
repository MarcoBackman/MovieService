import axios from "axios";



//Set session when user logs in
export const setSession  = function (userID) {
    axios.post('/security/postSession', {user : userID})
        .catch(err => {
            console.error(err);
        });
    console.log("session post successful");
}