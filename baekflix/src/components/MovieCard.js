import React, {useContext, useEffect, useState} from 'react';
import { GrView } from 'react-icons/gr';
import { MdOutlineFavorite, MdFavoriteBorder } from 'react-icons/md';


// Application Specific Imports
import MovieCardDetail from './MovieCardDetail';
import {requestAddFavorite, requestRemoveFavorite} from '../service/UserService';
import UserContext from "../context/UserContext";
import SessionContext from "../context/SessionContext";

//Styles
import '../stylesheet/MovieCard.css';

function convertTime(duration) {
    let time_string = ""
    let remainders = parseInt(duration / 60);
    let minutes = remainders % 60;
    remainders = parseInt(remainders / 60);
    let hours = remainders % 60;
    if (hours !== 0) {
        time_string += hours + "h";
    }

    if (minutes === 0) {
        time_string += "00m";
    } else if (minutes < 10) {
        time_string += "0" + minutes + "m";
    } else {
        time_string += minutes + "m";
    }
    return time_string;
}

function MovieCard(props) {
    const {user} = useContext(UserContext);
    const {session} = useContext(SessionContext);

    const [icon, setIcon] = useState(<MdFavoriteBorder/>);
    const [iconText, setIconText] = useState("Like");
    const [button, setButton] = useState(null);
    const [detailsShown, setDetailsShown] = useState(false);
    const [action, setAction] = useState(null);

    let setFavoriteMapSize = props.setFavoriteMapSize;
    let favoriteMapSize = props.favoriteMapSize;
    let movieId = props.data._id;

    //identify favorite list on favorite change
    useEffect(() =>  {
        identifyUserFavorite();
    }, [session.login, setIcon, icon, action, favoriteMapSize]);

    //Change icon on state change
    useEffect(() => {
        if (user.name === "Guest") {
            setButton(null);
        } else {
            setButton(
                <button type="button"  className="add_favorite" name="add_favorite" onClick={onFavClickHandler}>
                    {icon} {iconText}
                </button>
            );
        }
    },  [session.login] );


    function identifyUserFavorite() {
        if (user.name !== "Guest") {
            //user.favorite_map is a promise
            const isFavoriteMovie = user.favorite_map.get(movieId);
            if (isFavoriteMovie) {
                setIcon(<MdOutlineFavorite/>);
                setIconText("Unlike");
                setButton(
                    <button type="button"  className="add_favorite" name="add_favorite" onClick={onFavClickHandler}>
                        {icon} {iconText}
                    </button>
                );
                setAction("like")
            } else {
                setIcon(<MdFavoriteBorder/>);
                setIconText("Like");
                setButton(
                    <button type="button"  className="add_favorite" name="add_favorite" onClick={onFavClickHandler}>
                        {icon} {iconText}
                    </button>
                );
                setAction("unlike")
            }
        } else {
            setButton(
                null
            );
        }
    }

    //change icon and statement on fav button click
    async function onFavClickHandler(e) {
        e.preventDefault();
        let userId = user.name;

        try {
            if (iconText === "Like") { //Adding favorite
                let updateRequestStatus = await requestAddFavorite(userId, movieId);
                if (updateRequestStatus) {
                    console.log("Updating to unlike", props.data);
                    setIcon(<MdOutlineFavorite/>);
                    setIconText("Unlike");
                    user.favorite_map.set(movieId, props.data);
                    setFavoriteMapSize(user.favorite_map.size); // trigger re-render
                }
            } else {
                let updateRequestStatus = await requestRemoveFavorite(userId, movieId);
                if (updateRequestStatus) {
                    console.log("Updating to like");
                    setIcon(<MdFavoriteBorder/>);
                    setIconText("Like");
                    user.favorite_map.delete(movieId);
                    setFavoriteMapSize(user.favorite_map.size); // trigger re-render
                }
            }
        } catch (error) {
            console.log(error);
            // handle this error appropriately
        }
    }

    //Make sure to fetch on click
    //Switch view on clicking detailed view button
    function onViewClickHandler(e) {
        setDetailsShown(true);
        e.preventDefault();
    }

    if (!props.data || !props.data.image_url || !props.data.title) {
        return;
    }

    return (
        <article className="movieCard">
            <div className="overlay" style={{ display: detailsShown ? 'block' : 'none' }} ></div>
            <img className="movie_img"
                 src={props.data.image_url.replace("http", "https")}
                 onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = './movie.jpg'
                 }} alt={""}>
            </img>
            <div className="movie_title" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <p style={{flexWrap: 'wrap'}}>{props.data.title}</p>
            </div>
            <p>Rating: {props.data.rating}</p>
            <p>Duration: {convertTime(props.data.running_time_secs)}</p>
            <button type="button" className="view_detail" name="view_detail"
                    onClick={onViewClickHandler}>
                <GrView/> View Movie
            </button>
            {button}
            {detailsShown &&
                <MovieCardDetail data={props.data} detailShown={detailsShown} setDetailsShown={setDetailsShown}/>}
        </article>
    );
}

export default MovieCard;