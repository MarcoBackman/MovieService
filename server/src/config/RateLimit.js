const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs:  60 * 1000, // 1 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "You are doing that too often. Please take a break",
    handler: function(req, res, /*next*/) {
        console.log("Rate limit reached");
        res.status(429).send("You are doing that too often. Please take a break")
    }
});

module.exports = () => { return limiter; };