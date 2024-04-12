const model = require('mongoose').model;

const PasswordSchema = require('./password.schema.cjs');

const PasswordModel = model('Password', PasswordSchema);

function insertPassword(passwordAccount) {
    return PokemonModel.create(passwordAccount);
}

function getAllPassword() {
    return PokemonModel.find().exec();
}

function getPasswordByAccount(account) {
    return PokemonModel.find({ownerAccount: account}).exec();
}

function getPasswordById(id) {
    return PokemonModel.findById(id).exec();
}

function deletePasswordById(id) {
    return PokemonModel.deleteOne({_id: id})
}

function deletePasswordByAccount(account) {
    return PokemonModel.deleteMany({ownerAccount: account})
}

function updatePassword(id, password) {
    return PokemonModel.findOneAndUpdate({_id: id}, password)
}

// function getPokemonByOwner(owner) {
//     return PokemonModel.find({
//         owner: owner,
//     }).exec();
// }

// module.exports = {
//     getPokemonById,
//     deletePokemon,
//     updatePokemon,
//     insertPassword, 
//     getAllPokemon,
//     getPokemonByOwner
// }