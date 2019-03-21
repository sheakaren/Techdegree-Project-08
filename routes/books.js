var express = require('express');
var router = express.Router();
// include Book model
var Book = require("../models").Book;

// At the very least, you will need the following routes:
//     get / - Home route should redirect to the /books route.
router.get('/', (req, res, next) => {
    Book.findAll({order: [["id", "ASC"]]}).then(function(books){
        res.render("index", {books: books});
    }).catch(function(err){
        res.send(500);
    });
});
//     get /books - Shows the full list of books.
router.get('/books', (req, res) => {
    res.render("index")
});
//     get /books/new - Shows the create new book form.
router.get('/new', (req, res, next) => {
    res.render("new-book", {Title: "Fill out this form to add a book to our database"});
});
//     post /books/new - Posts a new book to the database.
router.post('/new', (req, res, next) => {
    Book.create(req.body).then(function(book){
        res.redirect('/books/' + book.id);
    }).catch(function(err){
        res.send(500);
    });
});
//     get /books/:id - Shows book detail form.
router.get('/books/:id', (req, res, next) => {
    Book.findById(req.params.id).then(function(book) {
        if(book) {
            res.render('update-book',{books: book});
          } else {
            res.render('page-not-found', 404);
          }
        }).catch((err) => {
          res.send(500, err);
        })
      });

//     post /books/:id - Updates book info in the database.
router.post('/books/:id', (req, res, next) => {
    Book.findById(req.params.id).then(function(book){
        if(book) {
        return book.update(req.body);
        } else {
            res.render('page-not-found', 404);
          }
    }).then(function(books){
        res.redirect("/books");
    }).catch(function(err){
        res.send(500);
    });
});
//     post /books/:id/delete - Deletes a book. Careful, this can’t be undone.
//         It can be helpful to create a new “test” book to test deleting.
router.post('/:id/delete', (req, res) => {
    Book.findById(req.params.id).then(function(book){
    if(book) {
        return book.destroy();
    } else {
        res.render('page-not-found', 404);
      }
    }).then(function(book){
        res.redirect("/books")
    }).catch(function(err){
        res.send(500);
    });
});
// Set up a custom error handler middleware function that logs the error to the console 
//     and renders an “Error” view with a friendly message for the user. 
//     This is useful if the server encounters an error, like trying to view 
//     the “Books Detail” page for a book :id that doesn’t exist. 
//     See the error.html file in the example-markup folder to see what this would look like.

// Set up a middleware function that returns a 404 NOT FOUND HTTP status code 
//     and renders a "Page Not Found" view when the user navigates to a non-existent route, 
//     such as /error. See the page_found.html file in the example markup folder 
    // for an example of what this would look like

module.exports = router;