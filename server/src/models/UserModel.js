const mongoose = require('mongoose');
const crypto = require('crypto');
const UserSchema = require('./UserSchema');

//For user Register
let userSchema = UserSchema.getSchema();

userSchema.methods.setPassword = function(password) {
    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');
    // Hashing user's salt and password with 1000 iterations,
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to check the entered password is correct or not
userSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

//Create Movie model based on movieData Schema
module.exports = mongoose.model('users', userSchema);