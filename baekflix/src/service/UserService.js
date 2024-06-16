import axios from "axios";
import {setSessionRequest} from "./SessionService";

/**
 * @param movieID
 * @returns {Promise}
 */
async function getMovieByLiked (movieID) {
    return await axios.get(`/movie/getMovieByID/${movieID}`)
        .then(async (resp) => {
            if (resp.data !== null) {
                return resp.data;
            }
        })
        .catch(err => {
            console.error(err);
            return [];
        });
}

//Must call this after session is retrieved
export const fetchAndSetUserFavorite = async function (userID, setUser) {
    // Consider moving the axios.post call here, so it will only run when there's a successful login
    const response = await axios.get(`/user/favorite/${userID}`).catch((err) => {
        console.info("Access denied. Need to login to fetch this");
    });
    if (response && response.data) {
        let map = new Map();
        for (const movieId of response.data) {
            let movieData = await getMovieByLiked(movieId);
            map.set(movieId, movieData);
        }

        setUser({
            name: userID,
            favorite_map: map
        });
    }
};

export const login = async function(form, setSession, setUser) {
    return await axios.post('/user/login', form)
        .then(resp => {
        if (resp.data === false) {
            alert("Login failed wrong ID/PW");
            return false;
        } else {
            //Send real session post to the server.
            //Username is equivalent to id here.
            setSessionRequest(form.id);

            setSession({
                login : true,
                status : "Sign out"
            });

            //Change user state
            setUser({
                name : form.id,
                favorite_map : new Map(),
                recent_watch_list : []
            });

            alert("Logged in success");
            return true;
        }
    }).catch(err => {
        console.error(err);
        alert("Failed request: Server Error");
        return false;
    });
}
/**
 * Successful response example
 * {
 *     "acknowledged": true,
 *     "modifiedCount": 1,
 *     "upsertedId": null,
 *     "upsertedCount": 0,
 *     "matchedCount": 1
 * }
 */
export const requestAddFavorite = async function(userId, movieId) {
    return await axios.put('/user/add_favorite', {id : userId, movieId: movieId})
        .then((resp) => {
            return resp.data.modifiedCount === 1;
        })
        .catch(err => {
            console.error(err);
            return false;
        });
}

/**
 * Successful response example
 * {
 *     "acknowledged": true,
 *     "modifiedCount": 1,
 *     "upsertedId": null,
 *     "upsertedCount": 0,
 *     "matchedCount": 1
 * }
 */
export const requestRemoveFavorite = async function requestRemoveFavorite(userId, movieId) {
    return await axios.delete('/user/remove_favorite', {data: {id : userId, movieId: movieId}})
        .then((resp) => {
            console.log(resp.data);
            return resp.data.modifiedCount === 1;
        })
        .catch(err => {
            console.error(err);
            return false;
        });
}

export const registerUser = async function registerUser(form) {
    //Post
    await axios.post('/user/register', form)
        .then(resp => {
            if (resp.data === false) {
                alert("Please choose different ID");
            } else {
                alert("User registered");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Failed request: Server Error");
        });
}