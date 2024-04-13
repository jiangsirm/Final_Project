const express = require('express');
const router = express.Router();
const PasswordModel = require('./mongoDB/password.model.cjs');

// /api/password
router.post('/', async function(req, res) {
    const requestBody = req.body;

    if(!requestBody.ownerAccount || !requestBody.passwordName || !requestBody.passwordValue) {
        res.status(401);
        return res.send("Please insert valid Inputs!")
    }

    const newPassword = {
        ownerAccount: requestBody.ownerAccount ,
        passwordName: requestBody.passwordName,
        passwordValue: requestBody.passwordValue,
    }

    // console.log(newPassword);

    try {
        const response = await PasswordModel.insertPassword(newPassword);
        return res.send(response);
    } catch (error) {
        res.status(400);
        return res.send(error);
    }

})

module.exports = router;