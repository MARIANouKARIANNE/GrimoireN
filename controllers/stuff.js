const Book = require('../models/book');
// création d'un nouveau livre 
exports.createBook = (req, res, next) => {
    // analyse du JSON en string 
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  // supprime le champ d'id 
  delete bookObject._userId;
  // pareil pour le user id 
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //créaion d'un nouveau livre 

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})

};
// le livre est enregstré dans la base de donnée 

//récupération d'un livre en partiulié graçe à son id 
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


//modification d'un livre existant 

exports.modifyBook = (req, res, next) => {
    // nouvel objet qui contient les donnnés que l'on va venir modofier
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

// supression d'un livre existant 

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

//récupération de l'intégralité des livres 

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

// récupération des livres les mieux notés 
exports.getBestRatedBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error: error.message }));
  };
  
  exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;
    // vérifie que la note est bien comprise dans l'intervalle choisit 
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'La note doit etre entre 0 et 5 , merci ' });
    }
  
    Book.findOne({ _id: req.params.id })
      .then(book => {
        // vérification que le livre n'a pas déjà était noté par un meme utilisateur 
        if (book.ratings.some(r => r.userId === userId)) {
          return res.status(400).json({ message: 'Vous avez déjà noté ce livre , merci ' });
        }
  // ajout de la nouvelle note 
        const newRating = { userId, grade: rating };
        book.ratings.push(newRating);
        book.averageRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / book.ratings.length;
  // sauvegarde du livre mis à jour 
        book.save()
          .then(updatedBook => res.status(200).json(updatedBook))
          .catch(error => res.status(400).json({ error: error.message }));
      })
      .catch(error => res.status(400).json({ error: error.message }));
  };