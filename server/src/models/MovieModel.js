const mongoose = require('mongoose');
const movieSchema = require('./MovieSchema');

let movieDataSchema = movieSchema.getSchema();

//Create Movie model based on movieData Schema
module.exports = mongoose.model('movies', movieDataSchema); // export 1 module per file