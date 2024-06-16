
let express = require("express");

let logger = require("../util/LogManager").getLogger('MovieController.js');
const MovieModel = require("../models/MovieModel");
const GenreModel = require("../models/GenreModel");

let router = express.Router();

// example: http://{host}:{port}/movie/getMovieByID/{id}
//Accepts as path variable
router.get('/getMovieByID/:movie', async (req, res) => {
    const ObjectId = require('mongoose').Types.ObjectId;
    let movieId = req.params.movie;

    const movieObject = {movieID: new ObjectId(movieId)};
    logger.debug("movieObject: " + movieObject.movieID);
    logger.debug("request movie id: " + movieId);

    try {
        let result = await MovieModel.findById(movieId);
        if (!result) {
            return res.json([]);
        }
        res.json(result);
    } catch(error) {
        console.error(`Database error: ${error}`);
        res.status(500).send({ error: 'Something went wrong.' });
    }
});

// example: http://{host}:{port}/movie/getGenreTypes
router.get('/getGenreTypes', async (req, res) => {
    let result = await GenreModel.find();
    res.json(result);
});

// example: http://{host}:{port}/movie/getMoviesByGenre?genre=<genre-value>
//Returns movie by genre sorted by rate descending order
router.get('/getMoviesByGenre', async (req, res) => {

    let genre_query = { "genres": req.query.genre };
    let sortByRateDescending = { 'rating' : -1};

    //Sort by rate first
    let result = await MovieModel.find(genre_query).sort(sortByRateDescending).limit(10);
    res.json(result);
});

module.exports = router;