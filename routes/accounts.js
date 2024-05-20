const express = require('express');
const Account = require('../models/account');
const router = express.Router();

router.post('/', async (req, res) => {
    const account = new Account({
        username: req.body.username,
        password: req.body.password
    });

    try {
        const newAccount = await account.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
