const Schema = require('mongoose').Schema;

module.exports = new Schema({
    ownerAccount: {
        type: String,
        required: true,
        unique: true
    },
    ownerPassword: {
        type:String,
        require: true
    }
    ,
    sharedWithMe: {
        type: Array,
        required: true,
        default:[]
    },
    pendingSharee: {
        type:Array,
        require:true,
        default:[]
    }
    ,
    accountCreated: {
        type: Date,
        default: Date.now
    }
}, { collection : 'accountSpr24' });

