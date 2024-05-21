

const Book = require('../models/book');

exports.createBook = (req, res, next) => {
  const book = new Book({
    title: req.body.title,
    auteur: req.body.auteur,
    imageUrl: req.body.imageUrl,
    thème: req.body.thème,
    année: req.body.année,
    note: req.body.note
  });
  book.save().then(
    () => {
      res.status(201).json({
        message: 'book saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.getOneBook = (req, res, next) => {
    Book.findOne({
      _id: req.params.id
    }).then(
      (book) => {
        res.status(200).json(book);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.modifyBook = (req, res, next) => {
    const book = new Book({
        title: req.body.title,
        auteur: req.body.auteur,
        imageUrl: req.body.imageUrl,
        thème: req.body.thème,
        année: req.body.année,
        note: req.body.note
      });
    Book.updateOne({_id: req.params.id}, book).then(
      () => {
        res.status(201).json({
          message: 'book updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  
  exports.deleteBook= (req, res, next) => {
    Book.deleteOne({_id: req.params.id}).then(
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };
  
  exports.getAllBook= (req, res, next) => {
    Book.find().then(
      (books) => {
        res.status(200).json(books);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };