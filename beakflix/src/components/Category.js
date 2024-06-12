import '../stylesheet/Category.css';
import axios from "axios";
import React, {useEffect, useState} from 'react';
import MovieCard from "./MovieCard";

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
        if (props.title === "My likes") {
            setUserCards();
        }
    }, [props.session.login, props.user.favorite_map.size]);

    function createUserMovieCardComponent(key, movieData) {
        return <MovieCard key={key} data={movieData} user={props.user} setUser={props.setUser}/>;
    }

    function setUserCards() {
        let userFavoriteMovieMap = props.user.favorite_map;

        console.log(props.user.favorite_map.size);

        let favComponentList = [];
        Array.from(userFavoriteMovieMap).map(([movieId, movieData], i) => {
            let userCardComponent = createUserMovieCardComponent(i, movieData);
            favComponentList.push(userCardComponent);
        })
        setUserMovieComponents(favComponentList);
        console.log(userMovieComponents);
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