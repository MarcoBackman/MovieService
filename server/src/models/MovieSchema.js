const mongoose = require('mongoose');
const { Schema } = mongoose;

let movieDataSchema = new Schema({
    title: String,
    year: Number,
    array: String,
    rating: Number,
    genres: Array,
    image_url: String,
    running_time_secs: Number
    });

function getSchema() {
    return movieDataSchema;
}

module.exports = { getSchema }