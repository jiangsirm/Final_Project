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

function addSharedAccount(sharer, sharee) {
    return AccountModel.findByIdAndUpdate(
        sharer._id, 
        { $push: { sharedWithMe: sharee } },
        {new: true}
    )
}

function removeSharedAccount(sharer, sharee) {
    return AccountModel.findByIdAndUpdate(
        sharer._id, 
        { $pull: { sharedWithMe: sharee } },
        {new: true}
    )
}

function removePendingAccount(sharer, sharee) {
    return AccountModel.findByIdAndUpdate(
        sharer._id, 
        { $pull: { pendingSharee: sharee } },
        {new: true}
    )
}

function addPendingAccount(sharer, sharee) {
    return AccountModel.findByIdAndUpdate(
        sharer._id, 
        { $push: { pendingSharee: sharee } },
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
    deleteAccountById,
    addPendingAccount,
    removePendingAccount
}