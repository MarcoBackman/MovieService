const mongoose = require('mongoose');
const { Schema } = mongoose;

let genreSchema = new Schema({
    genre: String,
    amount: {
        type:Number,
        default:0
    }
});

function getSchema() {
    return genreSchema;
}

module.exports = { getSchema }