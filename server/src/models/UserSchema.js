const mongoose = require('mongoose');
const { Schema } = mongoose;

let userSchema = new Schema(
    {
            id:
                {
                        type : String,
                        required : true
                },
            email:
                {
                        type : String,
                        required : typeof this.email !== 'string'
                },
            hash : String,
            salt : String,
            likedMovies : Array
    });

function getSchema() {
        return userSchema;
}

module.exports = { getSchema }