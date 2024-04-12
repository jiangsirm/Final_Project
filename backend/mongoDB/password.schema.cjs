const Schema = require('mongoose').Schema;

module.exports = new Schema({
    onwerAccount: {
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
        default: Date.now
    },
    sharedWithMe: {
        type: Array,
        required: true
    }
}, { collection : 'passwordSpr24' });