let express = require("express");

const UserModel = require("../models/UserModel");
const security = require("../config/Security");

let router = express.Router();

// example: http://{host}:{port}/user/login
//Login
router.post('/login', async (req, res) => {
    //There can be only one unique id
    try {
        const user = await UserModel.findOne({ id: req.body.id });
        if (!user) {
            return res.json(false);
        }

        const isValidPassword = await user.validPassword(req.body.pw);
        if (!isValidPassword) {
            return res.json(false);
        }

        req.session.username = user;
        return res.json(true);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

//Register
router.post('/register', async (req, res) => {

    try {
        const doesExist = await UserModel.exists({ id: req.body.id });
        if (doesExist) {
            return res.json(false);
        }

        const newUser = new UserModel({
            id: req.body.id,
            email: req.body.email,
            likedMovies: [],
        });
        newUser.setPassword(req.body.pw);

        await newUser.save();
        console.log('Registered user: ', req.body.id);
        return res.json(true);

    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while registering.' });
    }
});

//get favorite movies
router.get('/favorite/:id', async (req, res) => {
    try {
        const user = await UserModel.findOne({ id: req.params.id });
        if (!user) {
            return res.json(false);
        }

        return res.json(user.likedMovies);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching favorite movies.' });
    }
});

//add one favorite movie
router.put('/add_favorite',
    async (req, res) => {

        //There can be only one unique id
        let result = await UserModel.updateOne({ id: req.body.id }, {
            $addToSet: {
                likedMovies: req.body.movieId,
            },
        });
        res.json(result);
});

//add one favorite movie
router.delete('/remove_favorite', async (req, res) => {

    //There can be only one unique id
    let result = await UserModel.updateOne({ id: req.body.id }, {
        $pull: {
            likedMovies: req.body.movieId,
        },
    });
    res.json(result);
});

module.exports = router;