const Book = require('../models/book');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})

};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id }).then(
        (book) => {
            res.status(200).json(book);
        }
    ).catch(
        (error) => {
            res.status(404).json({ error: error.message });
        }
    );
};

exports.modifyBook = (req, res, next) => {
    const book = {
        userId: req.body.userId,
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        imageUrl: req.body.imageUrl,
        genre: req.body.genre,
        ratings: req.body.ratings || [],
        averageRating: req.body.averageRating || 0
    };

    Book.updateOne({ _id: req.params.id }, book).then(
        () => {
            res.status(200).json({ message: 'Livre modifié avec succès !' });
        }
    ).catch(
        (error) => {
            res.status(400).json({ error: error.message });
        }
    );
};

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(200).json({ message: 'Livre supprimé avec succès !' });
        }
    ).catch(
        (error) => {
            res.status(400).json({ error: error.message });
        }
    );
};

exports.getAllBook = (req, res, next) => {
    Book.find().then(
        (books) => {
            res.status(200).json(books);
        }
    ).catch(
        (error) => {
            res.status(400).json({ error: error.message });
        }
    );
};