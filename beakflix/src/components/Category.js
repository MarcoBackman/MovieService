import '../stylesheet/Category.css';
import axios from "axios";
import React, {useEffect, useState} from 'react';
import MovieCard from "./MovieCard";
const Movie = require( "../models/MovieSchema");

//This component only represents a single genre type
function Category(props) {
    //Movie React component into list where user added as favorite. Only visible after login
    const [userMovieComponents, setUserMovieComponents] = useState([]);

    //Stores React component into list for top 10 movies for normal case
    const [movieCardList, setMovieCardList] = useState([]);

    //Update movie data and html components on load.
    useEffect(() => {
        //If the category is for user favorite section, add this.s
        if (props.title === "My likes") {
            setUserCards();
        } else { //Regular cases like genre lists
            setMoviesByGenreType();
        }
    }, []);

    //Update movie card components and html components once data is changed
    useEffect(() => {
        //Todo: when user adds favorite, reload

        //
    }, []);

    /**
     * @param movieID
     * @returns {Promise<Movie>}
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

    async function createUserMovieCardComponent(key, movieData) {
        return <MovieCard key={key} data={movieData} user={props.user} setUser={props.setUser}/>;
    }

    async function setUserCards() {
        let userFavoriteMovieList = props.user.favorite_list;

        let favComponentList = [];
        for (let i = 0; i < userFavoriteMovieList.length; i++) {
            let movieData = await getMovieByLiked(userFavoriteMovieList[i]);
            let userCardComponent = await createUserMovieCardComponent(i, movieData);
            favComponentList.push(userCardComponent);
        }
        setUserMovieComponents(favComponentList);
    }


    async function createMovieCardComponents(movieDataList) {
        let cardList = [];
        for (let i = 0; i < movieDataList.length; i++) {
            if (movieDataList[i]) {
                cardList.push(<MovieCard key={i} data={movieDataList[i]} user={props.user}/>);
            }
        }
        return cardList;
    }

    /**
     * Fetches movie data by genre from the server and stores data and card componentS in to state
     * @returns {Promise<void>}
     */
    async function setMoviesByGenreType() {
        const form = {
            genre: props.title,
        };

        try {
            // Get Top 10 from each Genres by descending rate order
            const resp = await axios.get('/movie/getMoviesByGenre', { params : form});

            //Store data and crete cards
            let movieDataList = resp.data;
            if (movieDataList) {
                let createdCards = await createMovieCardComponents(movieDataList);
                setMovieCardList(createdCards);
            }
        } catch (err) {
            console.error('Error while setMoviesByGenreType:', err);        }
    }

    return (
        <div className="category_panel">
            <h1>{props.title}</h1>
            <div className="scroll_panel">
                <div className="card_field">
                    {/* Either one will be empty below */}
                    {userMovieComponents}
                    {movieCardList}
                </div>
            </div>
        </div>
    );
}

export default Category;