const model = require('mongoose').model;

const AccountSchema = require('./account.schema.cjs');

const AccountModel = model('Account', AccountSchema);

function getAccountById(accountId) {
    return AccountModel.findOne({_id: accountId}).exec();
}

function getAccountByName(accountName) {
    return AccountModel.findOne({ownerAccount: accountName}).exec();
}

function insertAccount(account) {
    return AccountModel.create(account);
}

function addSharedAccount(sharerId, sharee) {
    return AccountModel.findByIdAndUpdate(
        sharerId, 
        { $push: { sharedWithMe: sharee } },
        {new: true}
    )
}

function removeSharedAccount(sharerId, sharee) {
    return AccountModel.findByIdAndUpdate(
        sharerId, 
        { $pull: { sharedWithMe: sharee } },
        {new: true}
    )
}

function deleteAccountById(id) {
    return AccountModel.deleteOne({_id: id})
}


module.exports = {
    getAccountById,
    insertAccount,
    addSharedAccount,
    removeSharedAccount,
    getAccountByName,
    deleteAccountById
}