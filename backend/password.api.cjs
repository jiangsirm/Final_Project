const express = require('express');
const router = express.Router();
const PasswordModel = require('./mongoDB/password.model.cjs');
const AccountModel = require('./mongoDB/account.model.cjs')

// /api/password
router.post('/', async function(req, res) {
    const requestBody = req.body;

    if(!requestBody.ownerAccount || !requestBody.passwordName || !requestBody.passwordValue) {
        res.status(401);
        return res.send("Please insert valid Inputs! ownerAccount, passwordName, and passwordValue");
    }

    try {
        const owner = await AccountModel.getAccountByName(requestBody.ownerAccount)
        if (!owner) {
            res.status(401);
            return res.send("There is no such account name");
        }
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }

    const newPassword = {
        ownerAccount: requestBody.ownerAccount,
        passwordName: requestBody.passwordName,
        passwordValue: requestBody.passwordValue,
    }


    try {
        const response = await PasswordModel.insertPassword(newPassword);
        return res.send(response);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }

})

// /api/password/_id
router.put('/:id', async function(req, res) {
    const passwordId = req.params.id;
    const requestBody = req.body;

    if (!requestBody.ownerAccount || !requestBody.passwordName || !requestBody.passwordValue) {
        res.status(400);
        return res.send("You need to include ownerAccount, passwordName, and passwordValue in your request");
    }

    try {
        const passwordUpdateResponse = await PasswordModel.updatePassword(passwordId, requestBody);
        return res.send('Successfully updated password ID: ' + passwordId)
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})


// -> api/password/accountname => req.params.ownerAccount === accountname
router.get('/:accountName', async function(req, res) {
    const ownerAccount = req.params.accountName;

    try {
        const getPokemonResponse = await PasswordModel.getPasswordByAccount(ownerAccount);
        return res.send(getPokemonResponse);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

// /api/password/_id
router.delete('/:passwordId', async function(req, res) {
    const passwordId = req.params.passwordId;

    try {
        const deletePokemonResponse = await PasswordModel.deletePasswordById(passwordId);
        return res.send(deletePokemonResponse);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

module.exports = router;