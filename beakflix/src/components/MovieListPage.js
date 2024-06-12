import React, {useCallback, useEffect, useMemo, useState} from 'react';
import axios from "axios";

// Application Specific Imports
import NavigationBar from "./NavigationBar";
import Category from "./Category";

// Styles
import '../stylesheet/MovieListPage.css';



/**
 * Two category sections will be visible when user is logged
 * Otherwise only one category section will be visible
 * @param props
 * @returns {Element}
 * @constructor
 */
function MovieListPage(props) {

    //Key - array of genre(in alphabetical order) | Value - array[movie set(rate in ascending order)]
    const [genreList, setGenreList] = useState([]);
    const [listOfMoviesByCategory, setListOfMoviesByCategory] = useState([]);
    const [userCategory, setUserCategory] = useState(null);
    const [loadComponent, setLoadComponent] = useState(false);
    /*
        Response body example:
            [{"_id":"666375cb36ff9f7586d2ec9b","genre":"Action","__v":0,"amount":1051},
            {"_id":"666375cb36ff9f7586d2ec9d","genre":"Crime","__v":0,"amount":828}]
     */
    //fetch data from the server once
    useEffect(() => {
        async function getGenre() {
            try {
                const resp = await axios.get('/movie/getGenreTypes');
                if (resp.data !== null) {
                    let data = [];
                    for (let i = 0; i < resp.data.length; i++) {
                        if (resp.data[i].amount >= 10) {
                            data.push(resp.data[i].genre);
                        }
                    }
                    data.sort();
                    setGenreList(data);
                }
            } catch (err) {
                console.error("MovieListPage: " + err);
            }
        }
        getGenre().then(() => console.log("Done fetching types of genre"));
    }, []);

    //Hook to fetch user's movies (will only visible after login)
    useEffect(() => {
        if (props.session.login === true && props.user.favorite_map.size > 0) {
            setUserCategory(() =>
                (<Category key={'userLikes'}
                           title="My likes"
                           session={props.session}
                           user={props.user}
                           genreList={genreList}
                           setLoadComponent={setLoadComponent}
                />));
        } else {
            setUserCategory(null);
        }
    }, [props.user.favorite_map, props.session.login]);

    //Todo: refactor hook to rerender single genre type, not all.
    //Hook to fetch list of movies by genre
    useEffect(() => {
        const newListOfMoviesByCategory = genreList.map((genre, index) => (
            <Category
                key={`genre-${index}`}
                title={genre}
                session={props.session}
                user={props.user}
                setUser={props.setUser}
            />
        ));

        // Update the state to the new list
        setListOfMoviesByCategory(newListOfMoviesByCategory);

    }, [genreList, props.user, props.setUser]);

    return (
        <article id="register_page">
            <NavigationBar user={props.user} setUser={props.setUser} session={props.session} setSession={props.setSession}/>
            <div id="category_holder">
                {userCategory}
                {listOfMoviesByCategory}
            </div>
        </article>
    );
}

export default MovieListPage;
