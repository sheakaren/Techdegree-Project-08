var express = require('express');
var router = express.Router();
// include Book model
var Book = require("../models").Book;

// At the very least, you will need the following routes:
//     get / - Home route should redirect to the /books route.
router.get('/', (req, res, next) => {
    Book.findAll({order: [["id", "ASC"]]}).then(function(books){
        res.render("index", {books: books});
    }).catch(function(error){
        res.send(500, error);
    });
});

//     get /books/new - Shows the create new book form.
router.get('/new', (req, res, next) => {
    res.render("new-book");
});
//     post /books/new - Posts a new book to the database.
router.post('/new', (req, res, next) => {
    Book.create(req.body).then(function(book){
        res.redirect('/books');
    }).catch(function(error){
        if(err.name === "SequelizeValidationError") {
            res.render("/books/new", {
                book: Book.build(req.body),
                title: "Add a new book",
                errors: error.errors
            });
        } else {
            throw error;
        }
    }).catch(function(error){
        res.send(500, error);
    });
});
//     get /books/:id - Shows book detail form.
router.get('/:id', (req, res, next) => {
    Book.findByPk(req.params.id).then(function(book) {
        if(book) {
            res.render('update-book',{book: book, title: "Update a book"});
          } else {
            res.render('page-not-found', 404);
          }
        }).catch((error) => {
          res.send(500, error);
        })
      });

//     post /books/:id - Updates book info in the database.
router.post('/:id', (req, res, next) => {
    Book.findByPk(req.params.id).then(function(book){
        if(book) {
        return book.update(req.body);
        } else {
            res.render('page-not-found', 404);
          }
    }).then(function(book){
        res.redirect("/books");
    }).catch(function(error){
        if(err.name === "SequelizeValidationError") {
            var book = Book.build(req.body);
            book.id = req.params.id;
            res.render("update-book", {
                book: book,
                title: "Edit book",
                errors: error.errors
            });
        } else {
            throw error;
        }
    }).catch(function(error){
        res.send(500, error);
    });
});
//     post /books/:id/delete - Deletes a book. Careful, this can’t be undone.
//         It can be helpful to create a new “test” book to test deleting.
router.post('/:id/delete', (req, res, next) => {
    Book.findByPk(req.params.id).then(function(book){
    if(book) {
        return book.destroy();
    } else {
        res.send(404, error);
      }
    }).then(function(book){
        res.redirect("/books")
    }).catch(function(error){
        res.send(500, error);
    });
});

module.exports = router;