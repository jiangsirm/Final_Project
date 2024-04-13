const model = require('mongoose').model;

const PasswordSchema = require('./password.schema.cjs');

const PasswordModel = model('Password', PasswordSchema);

function insertPassword(passwordAccount) {
    return PasswordModel.create(passwordAccount);
}

function getAllPassword() {
    return PasswordModel.find().exec();
}

function getPasswordByAccount(account) {
    return PasswordModel.find({ownerAccount: account}).exec();
}

function getPasswordById(id) {
    return PasswordModel.findById(id).exec();
}

function deletePasswordById(id) {
    return PasswordModel.deleteOne({_id: id})
}

function deletePasswordByAccount(account) {
    return PasswordModel.deleteMany({ownerAccount: account})
}

function updatePassword(id, password) {
    return PasswordModel.findOneAndUpdate({_id: id}, password)
}

module.exports = {
    getAllPassword,
    getPasswordByAccount,
    getPasswordById,
    insertPassword, 
    deletePasswordByAccount,
    deletePasswordById,
    updatePassword
}