
let express = require("express");

let logger = require("../util/LogManager").getLogger('MovieController.js');
const MovieModel = require("../models/MovieModel");
const GenreModel = require("../models/GenreModel");

let router = express.Router();

// example: http://{host}:{port}/movie/getMovieByID
// req: request body - value: movieId
router.get('/getMovieByID', async (req, res) => {
    const ObjectId = require('mongoose').Types.ObjectId;
    const query = {movieID: new ObjectId(req.body.movie)};
    logger.info(req.body.movieID);
    let result = await MovieModel.findById(req.body.movie);
    logger.info(result);
    res.json(result);
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

    //Find genre value

    //Sort by rate first
    let result = await MovieModel.find(genre_query).sort(sortByRateDescending).limit(10);
    res.json(result);
});

module.exports = router;