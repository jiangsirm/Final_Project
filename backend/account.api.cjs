const express = require('express');
const router = express.Router();
const AccountModel = require('./mongoDB/account.model.cjs');
const cookieHelper = require('./cookie.helper.cjs');
const jwt = require('jsonwebtoken');

// /api/account/register
router.post('/register', async function(request, response) {
    const requestBody = request.body;

    const ownerAccount = requestBody.ownerAccount;
    const ownerPassword = requestBody.ownerPassword;

    if(!ownerAccount) {
        res.status(401);
        return res.send("Please insert valid Inputs! ownerAccount is required");
    }

    if(!ownerPassword) {
        res.status(401);
        return res.send("Please insert valid Inputs! ownerPassword is required");
    }

    const newUser = {
        ownerAccount: ownerAccount,
        ownerPassword: ownerPassword
    };

    try {
        const createUserResponse = await userModel.insertUser(newUser);

        const cookieData = {username: username};
        
        const token = jwt.sign(cookieData, 'POKEMON_SECRET', {
            expiresIn: '14d'
        });

        response.cookie('token', token, {httpOnly: true});

        return response.send('User with username ' + username + ' created.' )
    } catch (error) {
        response.status(400);
        return response.send('Failed to create user with message ' + error)
    }

});

// /api/account
router.post('/', async function(req, res) {
    const requestBody = req.body;

    if(!requestBody.ownerAccount) {
        res.status(401);
        return res.send("Please insert valid Inputs! ownerAccount is required");
    }

    if(!requestBody.ownerPassword) {
        res.status(401);
        return res.send("Please insert valid Inputs! ownerPassword is required");
    }

    const newAccount = {
        ownerAccount: requestBody.ownerAccount,
        ownerPassword: requestBody.ownerPassword
    }

    try {
        const response = await AccountModel.insertAccount(newAccount);
        return res.send(response);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

// api call for add/remove String from sharedWithMe Array
//api/account/
router.put('/', async function(req, res) {
    const sharerName = req.body.sharer;
    const shareeName = req.body.sharee;
    const action = req.body.action;
    let sharer = null;
    let sharee = null

    if(!shareeName) {
        res.status(401);
        return res.send("Please insert valid Inputs! sharee is required");
    }

    if(!sharerName) {
        res.status(401);
        return res.send("Please insert valid Inputs! sharer is required");
    }

    if (!action) {
        res.status(401);
        return res.send("Please insert valid Inputs! action is required");
    }

    if (action !== 'add' && action !== 'remove') {
        res.status(401);
        return res.send("Please insert valid Inputs! Action must be either 'add' or 'remove'.");
    }

    try {
        sharer = await AccountModel.getAccountByName(sharerName);
        sharee = await AccountModel.getAccountByName(shareeName);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }

    if (!sharer) {
        res.status(401);
        return res.send("Please insert valid Inputs! There is no such sharer");
    }

    if (!sharee) {
        res.status(401);
        return res.send("Please insert valid Inputs! There is no such sharee");
    }

    if (action === "add") {
        if (sharer.sharedWithMe.includes(shareeName)) {
            res.status(401);
            return res.send("This sharee already have the access!")
        }
    } else {
        if (!sharer.sharedWithMe.includes(shareeName)) {
            res.status(401);
            return res.send("This sharee is not shared!")
        }
    }

    try {
        const addSharee = action === "add" ? await AccountModel.addSharedAccount(sharer, shareeName): await AccountModel.removeSharedAccount(sharer, shareeName);
        let message = 'Successfully' + ( action === "add" ? " added " : " removed ") + sharee.ownerAccount.toString() + (action === "add" ? " to " : " from ") + sharer.ownerAccount.toString();
        return res.send(message);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

//api call used for add/remove string from pendingSharee Array
//api/account/pending
router.put('/pending', async function(req, res) {
    const sharerName = req.body.sharer;
    const shareeName = req.body.sharee;
    const action = req.body.action;
    let sharer = null;
    let sharee = null

    if(!shareeName) {
        res.status(401);
        return res.send("Please insert valid Inputs! sharee is required");
    }

    if(!sharerName) {
        res.status(401);
        return res.send("Please insert valid Inputs! sharer is required");
    }

    if (!action) {
        res.status(401);
        return res.send("Please insert valid Inputs! action is required");
    }

    if (action !== 'add' && action !== 'remove') {
        res.status(401);
        return res.send("Please insert valid Inputs! Action must be either 'add' or 'remove'.");
    }

    try {
        sharer = await AccountModel.getAccountByName(sharerName);
        sharee = await AccountModel.getAccountByName(shareeName);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }

    if (!sharer) {
        res.status(401);
        return res.send("Please insert valid Inputs! There is no such sharer");
    }

    if (!sharee) {
        res.status(401);
        return res.send("Please insert valid Inputs! There is no such sharee");
    }

    if (action === "add") {
        if (sharer.pendingSharee.includes(shareeName)) {
            res.status(401);
            return res.send("This sharee already sent the request!")
        }
    } else {
        if (!sharer.pendingSharee.includes(shareeName)) {
            res.status(401);
            return res.send("This sharee have not sent the request!")
        }
    }

    try {
        const addSharee = action === "add" ? await AccountModel.addPendingAccount(sharer, shareeName): await AccountModel.removePendingAccount(sharer, shareeName);
        let message = 'Successfully' + ( action === "add" ? " added " : " removed ") + sharee.ownerAccount.toString() + (action === "add" ? " to " : " from ") + sharer.ownerAccount.toString() + " Pending";
        return res.send(message);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

// api/account/accountname
router.get('/:accountName', async function(req, res) {
    const ownerAccount = req.params.accountName;

    try {
        const getAccountResponse = await AccountModel.getAccountByName(ownerAccount);
        return res.send(getAccountResponse);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

module.exports = router;