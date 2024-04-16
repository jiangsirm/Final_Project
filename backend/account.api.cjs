const express = require('express');
const router = express.Router();
const AccountModel = require('./mongoDB/account.model.cjs');

// /api/account
router.post('/', async function(req, res) {
    const requestBody = req.body;

    if(!requestBody.ownerAccount) {
        res.status(401);
        return res.send("Please insert valid Inputs! ownerAccount is required");
    }

    const newAccount = {
        ownerAccount: requestBody.ownerAccount,
    }

    try {
        const response = await AccountModel.insertAccount(newAccount);
        return res.send(response);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

//api/account/sharerId
router.put('/:sharer', async function(req, res) {
    const sharerId = req.params.sharer;
    const shareeName = req.body.sharee;
    let sharer = null;
    let sharee = null

    if(!shareeName) {
        res.status(401);
        return res.send("Please insert valid Inputs! sharee is required");
    }

    try {
        sharer = await AccountModel.getAccountById(sharerId);
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

    if (sharer.sharedWithMe.includes(shareeName)) {
        res.status(401);
        return res.send("This sharee already have the access!")
    }

    try {
        const addSharee = await AccountModel.addSharedAccount(sharer, shareeName);
        return res.send('Successfully added ' + sharee.ownerAccount.toString() + " to " + sharer );
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

//api/account/sharerId
router.delete('/:sharer', async function(req, res) {
    const sharerId = req.params.sharer;
    const shareeName = req.body.sharee;
    let sharer = null;
    let sharee = null

    if(!shareeName) {
        res.status(401);
        return res.send("Please insert valid Inputs! sharee is required");
    }

    try {
        sharer = await AccountModel.getAccountById(sharerId);
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

    if (!sharer.sharedWithMe.includes(shareeName)) {
        res.status(401);
        return res.send("This sharee is not shared!")
    }

    try {
        const addSharee = await AccountModel.removeSharedAccount(sharer, shareeName);
        return res.send('Successfully removed ' + sharee.ownerAccount.toString() + " from " + sharer);
    } catch (error) {
        res.status(400);
        return res.send(error.message);
    }
})

// api/account/owner
// router.get('/:accountId', async function(req, res) {
//     const ownerAccount = req.params.accountId;

//     try {
//         const getAccountResponse = await AccountModel.getAccountById(ownerAccount);
//         return res.send(getAccountResponse);
//     } catch (error) {
//         res.status(400);
//         return res.send(error.message);
//     }
// })

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