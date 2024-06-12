const mongoose = require('mongoose');

// For reference
let MovieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    directors: String,
    rating: Number,
    genres: Array,
    image_url: String,
    running_time_secs: Number
});