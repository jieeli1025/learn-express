const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

router.get('/usernames:name', (req, res) => {
  let name = req.params.name;
  let username = users.filter((user) => user.username === name);

  if (username.length === 0) {
    res.send('No user found');
  } else {
    res.send(username);
  }
});

router.get('/username/:name', (req, res) => {
  const { name } = req.params;
  const user = users.find(user => user.username === name);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: { message: 'User not found', status: 404 } });
  }
});

module.exports = router;
