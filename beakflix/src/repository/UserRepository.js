import axios from "axios";
import {setSession} from "./SessionRepository";

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

export const fetchAndSetUserFavorite = async function (userID, setUser) {
    // Consider moving the axios.post call here, so it will only run when there's a successful login
    const response = await axios.get(`/user/favorite/${userID}`);
    if (response.data) {
        let map = new Map();
        response.data.forEach((movieId) => {
            let movieData = getMovieByLiked(movieId);
            map.set(movieId, movieData);
        })

        setUser({
            name: userID,
            favorite_map: map
        });
    }
};

export const login = async function(form, setSession, setUser) {
    await axios.post('/user/login', form).then(resp => {
        if (resp.data === false) {
            alert("Login failed wrong ID/PW");
        } else {
            //Send real session post to the server.
            setSession(form.id);

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
        }
    })
        .catch(err => {
            console.error(err);
            alert("Failed request: Server Error");
        });
}