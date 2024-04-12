const Schema = require('mongoose').Schema;

module.exports = new Schema({
    onwerAccount: {
        type: String,
        required: true,
    },
    sharedWithMe: {
        type: Array,
        required: true
    },
    accountCreated: {
        type: Date,
        default: Date.now
    }
}, { collection : 'passwordSpr24' });

