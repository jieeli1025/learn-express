const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), (err, data) => {
    if (err) throw err;
    users = JSON.parse(data);
});

router.post('/adduser', (req, res) => {
    let newuser = req.body;
    users.push(newuser);
    fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(users), (err) => {
        if (err) console.log('Failed to write');
        else console.log('User Saved');
    });
    res.send('done');
});

module.exports = router;
