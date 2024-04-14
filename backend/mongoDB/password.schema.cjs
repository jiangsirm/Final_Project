const Schema = require('mongoose').Schema;

module.exports = new Schema({
    ownerAccount: {
        type: String,
        required: true,
    },
    passwordName: {
        type: String,
        required: true
    },
    passwordValue: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        required: false
    }
}, { 
    collection : 'passwordSpr24' 
}).index({ ownerAccount: 1, passwordName: 1 }, { unique: true });