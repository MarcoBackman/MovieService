//Checks if db contains all the contents in the local json file
let mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const MovieModel = require("../models/MovieModel");
const GenreModel = require("../models/GenreModel");
const LogManager = require("../util/LogManager");
const logger = LogManager.getLogger('DBConfiguration.js');
const defaultMovieData = "./src/data/moviedata.json";

let config = require("../../config.json");
let dbConfig = config.database;
let dbName = dbConfig.dbname;

async function createMovieModel(singleMovie) {
    try {
        await MovieModel.create({
            title : singleMovie.title,
            year : singleMovie.year,
            directors : singleMovie.info.directors,
            rating : singleMovie.info.rating,
            genres : singleMovie.info.genres,
            image_url : singleMovie.info.image_url,
            running_time_secs : singleMovie.info.running_time_secs
        });
    } catch (err) {
        console.log(err);
    }
    console.log("Movie added:" + singleMovie.title);
}

async function updateOrCreateGenreModel(genreName) {
    try {
        await GenreModel.findOneAndUpdate({genre : genreName},  {$inc: {amount: 1}}, {upsert: true});
    } catch(err) {
        console.log(err);
    }
}

async function findMovieModel(singleMovie) {
    //Find if data object exists
    const res = await MovieModel.exists({
        title: singleMovie.title,
        year: singleMovie.year,
    });
    return res;
}

async function initializeMovieModel (singleMovie) {
    const res = await findMovieModel(singleMovie);

    //If local data does not exist in DB
    if (res == null) {
        await createMovieModel(singleMovie);

        //Genre may not be defined
        if (typeof singleMovie.info.genres === 'undefined') {
            return;
        }

        let genreList = singleMovie.info.genres;
        for (let i = 0; i < genreList.length; i++) {
            await updateOrCreateGenreModel(genreList[i]);
        }
    }
}

//iterate the local data and compare with db model data
async function mongoDBConnectAndInit (data) {
    const isCloudDb = dbConfig.isCloudDb;
    const cloudDbUri = dbConfig.cloudDbFullUrl;

    //MongoDB cloud connection
    if (isCloudDb === true) {
        logger.info("Connecting cloud DB");

        const client = new MongoClient(cloudDbUri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        async function connect() {
            try {
                // Connect the client to the server	(optional starting in v4.7)
                await client.connect();
                // Send a ping to confirm a successful connection
                await mongoose.connect(cloudDbUri);
                await mongoose.connection.on('error', () => logger.error("Connection failed"));
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
            }
        }
        connect().catch(console.dir);
    } else { //MongoDB non-cloud connection
        const mongoDBUrlNoAuth = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbname}`;
        const mongoDBUrl = new URL(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbname}`);
        mongoDBUrl.username = '***';
        mongoDBUrl.password = '***';
        try {
            let mongoDbUrlStr = dbConfig.hasAuth === false ? mongoDBUrlNoAuth.toString() : mongoDBUrl.toString();
            logger.info("Connecting to mongoDB: " + mongoDbUrlStr);
            await mongoose.connect(mongoDbUrlStr);
            await mongoose.connection.on('error', () => logger.error("Connection failed"));
        } catch (err) {
            logger.error("Database connection error", err);
            throw err;
        }
    }

    data.map(async (singleMovie) => {
        logger.info("Initializing movie schema and data");
        await initializeMovieModel(singleMovie);
        logger.info("Initialization movie schema and data are done.");
    });
}

async function synchronizeLocalFile() {
    logger.info("Checking DB data");
    try {
        const dataFile = fs.readFileSync(defaultMovieData, 'utf8');
        let data = JSON.parse(dataFile);

        //Mongo DB connect and inject local dataFile's data to database
        await mongoDBConnectAndInit(data);
        logger.info("Completed file synchronization.");
    } catch (err) {
        logger.error(err)
    }
}

module.exports = { synchronizeLocalFile };