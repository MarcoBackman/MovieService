/*
    This file handles cookies, session and page permissions
 */

let mongoose = require('mongoose');

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

let express = require("express");
let router = express.Router();

//Setup cookie -> client side
router.post('/cookieSetup', async (req, res) => {

    //Cookie options
    let options = {
        maxAge: 1000, // * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: true, // Indicates if the cookie should be signed
        secure: true,
    }
    //Set cookie
    res.cookie('username', req.body.user, options);

    //Get cookie info
    console.log('Cookies: ', res.cookies);

    // Set session id as userID if valid
    if (req.body.user !== 'Guest') {
        console.log("Session setted!");
        req.session.username = req.body.user;
    } else {
        console.log("Session destroyed");
        req.session.destroy();
    }
});

router.get('/getCookie', async (req, res) => {
    //Get cookie info
    console.log('Cookies: ', req.cookies.username);
    res.cookie('username', req.body.user, options);
});

router.get('/deleteCookie', (req, res) => {
    //show the saved cookies
    res.clearCookie('username');
    res.send("Server says : Done");
    console.log("Cookie has been deleted successfully");
});

router.get('/sessionLogout', (req, res) => {
    console.log("Set logout");
    req.session.username = '';
    res.end('done');
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
        console.log("Session id: "+ req.session.username);
        res.send(req.session.username);
    }
});

// This section will help you create a new document.
module.exports = router;