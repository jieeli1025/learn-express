const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), function (err, data) {
  console.log('reading file ... ');
  if (err) throw err;
  users = JSON.parse(data);
})


const addMsgToRequest = function (req, res, next) {
  if (users) {
    req.users = users;
    next();
  }
  else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }

}

app.use(
  cors({ origin: 'http://localhost:3000' })
);
app.use('/read/usernames', addMsgToRequest);


app.get('/read/usernames:name', (req, res) => {
  let name = req.params.name;
  let username = req.users.filter((user) => {
    return user.username === name;

  })
  if (username.length === 0) {
    res.send('No user found');
  } else {
    res.send(username);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req, res) => {
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
})


app.get('/read/username/:name', (req, res) => {
  const { name } = req.params; // Extract the username from the URL parameter

  // Find the user with the specified username
  const user = req.users.find(user => user.username === name);

  if (user) {
    res.json(user); // Send the user object as JSON response
  } else {
    res.status(404).json({ error: { message: 'User not found', status: 404 } });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
