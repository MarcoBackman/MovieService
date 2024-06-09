const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const appLogger = require('./util/LogManager').getLogger('app.js');
const serverConfig = require("../config.json");
const security = require('./config/Security');


//Routers
let userRouter = require("./controller/UserController");
let movieRouter = require("./controller/MovieController");
let opsRouter = require("./controller/OpsController");
let credentialRouter = require("./controller/SecurityController");

//Express setup
const app = express();
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = serverConfig.server.port;

//Listen requests
app.listen(port, () => appLogger.info("Server ready on port:" + port));

//Check database data with the local file
let synchronizeData = require('./config/DBConfiguration');

(async () => await synchronizeData.synchronizeLocalFile().catch(() => {
    appLogger.error("Database connection failed");
}).finally(() => {
    appLogger.info("Database config stage completed.");
}))();

//Signed cookie setup
app.use(cookieParser(serverConfig.cookie.secret));

//Application security setup
app.use(cors(security.getCorsPolicy()));
app.use(logger('dev'));

//Session depended on cookie
app.use(security.setSessionSetup());
app.use((req, res, next)=> { security.autoLoadUserSession(req, res, next) })

//Setup REST api views - route handlers
app.use("/user", userRouter);
app.use("/movie", movieRouter);
app.use("/ops", opsRouter);
app.use("/security", credentialRouter);

// Todo: catch 404 and forward to error handler, add timeout
app.use(function(req, res, next) {
    next(createError(404));
});



module.exports = app;
