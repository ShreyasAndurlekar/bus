const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Account = require('../models/account'); 

const dasecretey = ""

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Account.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, dasecretey)
        res.json({ username: user.username, token});
        
    } catch (error) {

        console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
