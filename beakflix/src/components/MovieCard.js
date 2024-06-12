import React, {useEffect, useState} from 'react';
import MovieCardDetail from './MovieCardDetail';
import axios from "axios";

import '../stylesheet/MovieCard.css';
import { MdOutlineFavorite, MdFavoriteBorder } from 'react-icons/md';
import { GrView } from 'react-icons/gr';

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
    const [icon, setIcon] = useState(<MdFavoriteBorder/>);
    const [iconText, setIconText] = useState("Like");
    const [button, setButton] = useState(null);
    const [detailsShown, setDetailsShown] = useState(false);
    let movieId = props.data._id;
    //identify favorite list on favorite change
    useEffect(() => {
        identifyUserFavorite();
    }, [props.user.favorite_map]);

    //Change icon on state change
    useEffect(() => {
        if (props.user.name === "Guest") {
            setButton(null);
        } else {
            setButton(
                <button type="button"  className="add_favorite" name="add_favorite" onClick={onFavClickHandler}>
                    {icon} {iconText}
                </button>
            );
        }
    },  [props.user.name] );


    function identifyUserFavorite() {
        if (props.user.name !== "Guest") {
            if (props.user.favorite_map.get(movieId)) {
                console.log("Is liked")
                setIcon(<MdOutlineFavorite/>);
                setButton(
                    <button type="button"  className="add_favorite" name="add_favorite" onClick={onFavClickHandler}>
                        {icon} {iconText}
                    </button>
                );
            } else {
                setButton(
                    <button type="button"  className="add_favorite" name="add_favorite" onClick={onFavClickHandler}>
                        {icon} {iconText}
                    </button>
                );
            }
        } else {
            setButton(
                null
            );
        }
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
    async function requestAddFavorite() {
        let target = props.data._id;
        await axios.put('/user/add_favorite', {id : props.user.name, movieId: target})
            .then((resp) => {
                console.debug(resp);
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
    async function requestRemoveFavorite() {
        console.log("Remove request");
        await axios.post('/user/remove_favorite', {id : props.user.name, movieId: props.data._id})
            .then((resp) => {
                console.debug(resp);
                return resp.data.modifiedCount === 1;
            })
            .catch(err => {
                console.error(err);
                return false;
            });
    }

    //change icon and statement on fav button click
    async function onFavClickHandler(e) {
        e.preventDefault();
        //If not liked -> add to user favorite DB
        if (iconText === "Like") {
            //Add to DB first
            let updatedStatus = await requestAddFavorite();
            setIcon(<MdOutlineFavorite/>);
            setIconText("Unlike");
            if (updatedStatus) {
                props.user.favorite_map.set(props.data._id, props.data);
            }
        } else {
            //Remove from user favorite DB
            let updatedStatus = await requestRemoveFavorite();
            setIcon(<MdFavoriteBorder/>);
            setIconText("Like");
            if (updatedStatus) {
                props.user.favorite_map.delete(props.data._id);
            }
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