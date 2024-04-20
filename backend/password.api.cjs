const express = require('express');
const router = express.Router();
const PasswordModel = require('./mongoDB/password.model.cjs');
const AccountModel = require('./mongoDB/account.model.cjs');
const cookieHelper = require('./cookie.helper.cjs');
const PasswordGenerator = require('./PasswordGenerator.cjs')

// /api/password
router.post('/', async function(req, res) {
    const requestBody = req.body;
    const ownerAccount = cookieHelper.cookieDecryptor(req)

    if(!ownerAccount || !requestBody.passwordName) {
        res.status(401);
        return res.send("Please insert valid Inputs! ownerAccount, passwordName");
    }

    let passwordValue = "";
    if (!requestBody.passwordValue) {
        if (Object.values(requestBody.requirements).every(v => v === false)) {
            res.status(401);
            return res.send("Please enter a non-blank password Or check at least one requirment to generate password.");
        }
        passwordValue = await PasswordGenerator.PasswordGenerator(requestBody.length, requestBody.requirements);
    } else {
        passwordValue = requestBody.passwordValue;
    }

    // console.log("happy" + passwordValue)

    try {
        const owner = await AccountModel.getAccountByName(ownerAccount)
        if (!owner) {
            res.status(401);
            return res.send("There is no such account name");
        }

    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }

    const newPassword = {
        ownerAccount: ownerAccount,
        passwordName: requestBody.passwordName,
        passwordValue: passwordValue,
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

    // utility function for checking blank input
    function isBlank(str) {
        return !str || /^\s*&/.test(str);
    }

    if(isBlank(requestBody.ownerAccount) || isBlank(requestBody.passwordName) ||isBlank(requestBody.passwordValue)) {
        res.status(400);
        return res.send("Neith ownerAccount, passwordName, passwordValue should be blank");
    }

    try {
        const owner = cookieHelper.cookieDecryptor(req);
        const password = await PasswordModel.getPasswordById(passwordId);
        if (password !== null && password.ownerAccount !== owner) {
            res.status(400);
            return res.send("This is not your Password");
        }

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
        const curAccount = cookieHelper.cookieDecryptor(req);
        const owner = await AccountModel.getAccountByName(curAccount)

        if (!owner.sharedWithMe.includes(ownerAccount)) {
            res.status(401)
            return res.send("This account have not shared password with you")
        }
    } catch(e) {
        res.status(400)
        return res.send(e.message)
    }

    try {
        const getPokemonResponse = await PasswordModel.getPasswordByAccount(ownerAccount);
        return res.send(getPokemonResponse);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

// -> api/password/(when logged in) will return the ownerAccount of the logged in user
router.get('/', async function(req, res) {
    try {
        const ownerAccount = cookieHelper.cookieDecryptor(req);
        const getResponse = await PasswordModel.getPasswordByAccount(ownerAccount);
        return res.send(getResponse);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

// /api/password/_id
router.delete('/:passwordId', async function(req, res) {
    const passwordId = req.params.passwordId;

    try {
        const ownerAccount = cookieHelper.cookieDecryptor(req);
        const curPassword = await PasswordModel.getPasswordById(passwordId);
        if (ownerAccount !== curPassword.ownerAccount) {
            res.status(400);
            return res.send("You can only delete your own password!");
        }

        const deleteResponse = await PasswordModel.deletePasswordById(passwordId);
        return res.send(deleteResponse);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

module.exports = router;