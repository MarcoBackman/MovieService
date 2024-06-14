import React, {useContext, useEffect, useState} from 'react';

// Application Specific Imports
import MovieCard from "./MovieCard";
import {getMoviesByGenre} from '../service/MovieService';
import UserContext from "../context/UserContext";
import SessionContext from "../context/SessionContext";

// Styles
import '../stylesheet/Category.css';

//This component only represents a single genre type
function Category(props) {
    const {user, setUser} = useContext(UserContext);
    const {session, setSession} = useContext(SessionContext);

    //Stores React component into list for top 10 movies for normal case
    const [movieCardList, setMovieCardList] = useState([]);
    const [userMovieCardList, setUserMovieCardList] = useState([]);
    const [favoriteMapSize, setFavoriteMapSize] = useState(user.favorite_map.size);

    //Update movie card components and html components once data is changed
    useEffect(() => {
        const isUserCategoryCheck = user.favorite_map.size > 0;

        if (isUserCategory() === false) {
            setMoviesByGenreType().then(value => () => {
                console.log("Genre " + props.title + " category initialized");
            });
        } else {
            if (isUserCategoryCheck > 0) {
                setUserMovieCardComponent();
            } else {
                setUserMovieCardList(null);
            }
        }
    }, [favoriteMapSize, isUserCategory]);

    function isUserCategory() {
        return props.title === "My likes" && session.login === true;
    }

    function createMovieCardComponent(key, movieData) {
        return <MovieCard key={key} data={movieData} favoriteMapSize={favoriteMapSize} setFavoriteMapSize={setFavoriteMapSize}/>;
    }

    /**
     * Fetches movie data by genre from the server and stores data and card componentS in to state
     * @returns {Promise<void>}
     */
    async function setMoviesByGenreType() {
        try {
            // Get Top 10 from each Genres by descending rate order
            const resp = await getMoviesByGenre(props.title);

            //Store data and crete cards
            let movieDataList = resp.data;
            if (movieDataList) {
                let createdCards = [];
                movieDataList.forEach((movieData, index) => {
                    createdCards.push(createMovieCardComponent(index, movieData));
                });
                setMovieCardList(createdCards);
            }
        } catch (err) {
            console.error('Error while setMoviesByGenreType:', err);
        }
    }

    function setUserMovieCardComponent() {
        if (isUserCategory()) {
            let tempUserCompArr = [];
            Array.from(user.favorite_map.keys()).map((key, index) => {
                tempUserCompArr.push(createMovieCardComponent(index, user.favorite_map.get(key)));
            });
            setUserMovieCardList(tempUserCompArr);
        }
    }

    return (
        <div className="category_panel">
            <h1>{props.title}</h1>
            <div className="scroll_panel">
                <div className="card_field">
                    {/* Either one will be empty below */}
                    {userMovieCardList}
                    {movieCardList}
                </div>
            </div>
        </div>
    );
}

export default Category;