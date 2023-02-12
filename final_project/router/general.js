const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //return res.status(200).json(users[0].username);
  if (username && password) {
    if (isValid(username)) {
      users.push({
        username: username,
        password: password
      })
      return res.status(200).json("New user added: " + username);
    } else {
      return res.status(404).json("This user " + username + " already exist");
    }
  }
  return res.status(404).json("Error missing credentials");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(JSON.stringify(books[isbn]));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filtered = []
  for (book in books) {
    if (books[book].author == author) {
      filtered.push(books[book]);
    }
  }
  return res.status(200).json(JSON.stringify(filtered));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filtered = []
  for (book in books) {
    if (books[book].title == title) {
      filtered.push(books[book]);
    }
  }
  return res.status(200).json(JSON.stringify(filtered));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;