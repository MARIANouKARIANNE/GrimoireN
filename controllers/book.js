const Book = require('../models/book');
const fs = require('fs'); // pour la manipulation des fichiers 
const sharp = require('sharp');// traitement des images
const path = require('path'); // gestion des chemins 

// Création d'un nouveau livre
exports.createBook = async (req, res, next) => {
    // extraction des données à partir du corps de la requete 
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  try {
    // ajout de Sharp pour l'éco norme , réduction de la taille 
    const processedImagePath = path.join('images', req.file.filename);
    await sharp(req.file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(processedImagePath);

    book.save()
      .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
      .catch(error => { res.status(400).json({ error }) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
  }
};

// Récupération d'un livre en particulier grâce à son id
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

// Modification d'un livre existant
exports.modifyBook = async (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(async (book) => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé !' });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce livre.' });
      }

      const bookObject = req.file ? 
      {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };

      if (req.file) {
        // Tencore ici utilisation de sharp 
        const processedImagePath = path.join('images', req.file.filename);
        await sharp(req.file.buffer)
          .resize({ width: 800 })
          .jpeg({ quality: 80 })
          .toFile(processedImagePath);
      }

      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'un livre déjà existant 
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé !' });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce livre.' });
      }

      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé avec succès !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Récupération de tout les livres 
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

// Récupération des livres les mieux notés
exports.getBestRatedBooks = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error: error.message }));
};

// Ajout d'une note à un livre
exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être entre 0 et 5, merci.' });
  }

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé !' });
      }
      if (book.ratings.some(r => r.userId === userId)) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre, merci.' });
      }
      const newRating = { userId, grade: rating };
      book.ratings.push(newRating);
      book.averageRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / book.ratings.length;
      book.save()
        .then(updatedBook => res.status(200).json(updatedBook))
        .catch(error => res.status(400).json({ error: error.message }));
    })
    .catch(error => res.status(400).json({ error: error.message }));
};