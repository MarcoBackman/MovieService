const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

let express = require("express");
const serverConfig = require("../../config.json");
let router = express.Router();

//Setup cookie -> client side
router.post('/setCookie',
    [
        // username must be an email
        check('user').isLength({ min: 1 }).escape().trim()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            //Cookie options
            let options = {
                maxAge: 60 * 15 * 1000, // * 60 * 15, // would expire after 15 minutes
                httpOnly: true, // The cookie only accessible by the web server
                signed: true, // Indicates if the cookie should be signed
                secure: serverConfig.cookie.ssl,
            }
            //Set cookie
            res.cookie('GUEST-COOKIE', req.body.user, options);

            // Set session id as userID if valid
            if (req.body.user !== 'Guest') {
                console.log("session set for user:" + req.body.user);
                req.session.username = req.body.user;
            } else {
                console.log("Guest login, session destroyed");
                req.session.destroy();
            }
            res.status(200).send({ message: "Cookie Setup Success" });
        } catch (error) {
            console.error(`Error on server while setting cookies: ${error}`);
            res.status(500).send({ error: 'Something went wrong.' });
        }
});

router.get('/getCookie', (req, res) => {
    if (req.signedCookies['GUEST-COOKIE'] || req.cookies['GUEST-COOKIE']) {
        console.log('Cookies: ', req.signedCookies['GUEST-COOKIE'], req.cookies['GUEST-COOKIE']);
        res.status(200).json({ message: "Cookie retrieved successfully",
            'GUEST-COOKIE': req.cookies['GUEST-COOKIE'],
            'signed GUEST-COOKIE': req.signedCookies['GUEST-COOKIE']
        });
    } else {
        console.error("No GUEST-COOKIE found");
        res.status(400).json({ error: 'No GUEST-COOKIE found' });
    }
});

router.delete('/deleteCookie', (req, res) => {
    if(req.cookies['GUEST-COOKIE'] || req.signedCookies['GUEST-COOKIE']) {
        res.clearCookie('GUEST-COOKIE', { secure: serverConfig.cookie.ssl, httpOnly: true });
        res.send("Server says : guest cookie deleted.");
        console.log("Cookie has been deleted successfully");
    } else if (req.cookies.username || req.signedCookies.username) {
        res.clearCookie('username', { secure: true, httpOnly: true });
        res.send("Server says : user cookie deleted.");
        console.log("Cookie has been deleted successfully");
    } else {
        res.send("Server says : No such cookie");
        console.log("Failed to delete cookie - it does not exist");
    }
});

router.post('/sessionLogout', (req, res) => {
    if(req.session.username) {
        delete req.session.username;
        console.log("Successful logout");
        res.status(200).end('Done');
    } else {
        console.log("Logout failed - no such session");
        res.status(400).end('No such session');
    }
});


router.post('/postSession', (req, res) => {
    console.log("Set session to user");
    console.log(req.body.user);
    req.session.username = req.body.user;
    res.end('done');
});

//Setup session based on the cookie -> serverside only
router.get('/getSession', (req, res) => {
    console.log("Session info: ");
    console.log(req.session);

    if(req.session.id === undefined){
        console.log("Username not present in session");
    } else {
        res.send(req.session);
    }
});

// This section will help you create a new document.
module.exports = router;