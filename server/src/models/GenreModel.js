const mongoose = require('mongoose');
const genreSchema = require('./GenreSchema')

module.exports = mongoose.model('genres', genreSchema.getSchema()); // export 1 module per file