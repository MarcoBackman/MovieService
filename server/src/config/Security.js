const csrf = require('csrf');
const session = require('express-session');
const micromatch= require("micromatch");

const serverConfig = require("../../config.json");
const logger = require('../util/LogManager').getLogger('Security.js');

const csrfTokens = new csrf();
const secret = csrfTokens.secretSync();
const sessionKey = serverConfig.session.sessionKey;
const sessionTime = serverConfig.session.sessionTime;
const whiteListSessionEndpoints = serverConfig.session.whiteListSession;

logger.info("whiteListSessionEndpoints = " + whiteListSessionEndpoints);

/**
 * CORS POLICY
 * @returns {{credentials: boolean, origin: *}}
 */
function getCorsPolicy() {
    let whitelist = serverConfig.server.corsWhiteList;
    logger.info("CORS policy= " + whitelist)
    return {
        origin: function (origin, callback) {
            let originIsWhitelisted = whitelist.some(function(whitelistedOrigin){
                if (origin === undefined){
                    return true;
                }
                logger.info("Requester's origin is: " + origin);
                return origin.startsWith(whitelistedOrigin);
            });

            // If the origin is either in the whitelist or is undefined (which indicates that the request came from the same origin server), it's allowed.
            if (originIsWhitelisted) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }
}

function pathMatchesWhitelist(whitelist, path) {
    logger.info("Whitelist endpoint that can skip session check =" + whitelist.toString());
    for (const pattern of whitelist) {
        if (micromatch.isMatch(path, pattern)) {
            return true;
        }
    } return false;
}

/**
 * Session management
 * @param req
 * @param res
 * @param next
 */
function autoLoadUserSession(req, res, next) {
    //allow white listed endpoint for session
    if(whiteListSessionEndpoints.includes(req.path)
        || pathMatchesWhitelist(whiteListSessionEndpoints, req.path)
        || req.session.username) {
        req.username = req.session.username;
        next();
    } else {
        // Session has expired and/or we don't recognize the user
        res.status(403).send("Session expired or user not recognized");
    }
}

function setSessionSetup() {
    return session({
        secret: sessionKey, //secret key
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: sessionTime,
            httpOnly: true,
            secure: false // set to true on production, requires https
        },
        rolling: true //reset session timeout on valid user request
    });
}


//Todo: add csrf security

module.exports = {getCorsPolicy, autoLoadUserSession, setSessionSetup};