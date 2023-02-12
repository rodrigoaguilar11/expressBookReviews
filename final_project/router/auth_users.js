const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  for (user in users) {
    if (users[user].username == username) {
      return false;
    }
  }
  return true
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean  
  const account = users.filter(user => user.username == username);
  //console.log(account[0].username)
  if (account.length > 0) {
    return (account[0].password == password)
  }
  //write code to check if username and password match the one we have in records.
}

//only registered users can login 
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //evaluate if missing credentials
  if (!username || !password) {
    return res.status(404).json({
      message: "invalid credentials"
    });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {
      expiresIn: 60 * 60
    });
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json("Successful login, Welcome "+username);
  } else {
    return res.status(200).json("invalid credentials");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  //console.log(req.session.authorization)
  let reviews = books[isbn].reviews
  reviews[username] = review;
console.log(reviews)
  return res.status(200).json({
    message: username+" was added a review: "+review+". in the book "+ books[isbn].title
  })
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let reviews = books[isbn].reviews
  delete reviews[username];
  console.log(reviews)
  return res.status(200).json({
    message: "The user review "+username+" in the book "+ books[isbn].title+ " was deleted"
  })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
