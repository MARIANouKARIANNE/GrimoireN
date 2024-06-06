const Book = require('../models/book');

// Création d'un nouveau livre
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
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) });
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
exports.modifyBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ error: 'Livre non trouvé !' });
            }
            // Vérifie que l'utilisateur est bien le propriétaire du livre
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce livre.' });
            }

            const updatedBook = {
                userId: req.body.userId,
                title: req.body.title,
                author: req.body.author,
                year: req.body.year,
                imageUrl: req.body.imageUrl,
                genre: req.body.genre,
                ratings: req.body.ratings || [],
                averageRating: req.body.averageRating || 0
            };

            Book.updateOne({ _id: req.params.id }, updatedBook)
                .then(() => {
                    res.status(200).json({ message: 'Livre modifié avec succès !' });
                })
                .catch((error) => {
                    res.status(400).json({ error: error.message });
                });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Suppression d'un livre existant
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ error: 'Livre non trouvé !' });
            }
            // Vérifie que l'utilisateur est bien le propriétaire du livre
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce livre.' });
            }

            Book.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({ message: 'Livre supprimé avec succès !' });
                })
                .catch((error) => {
                    res.status(400).json({ error: error.message });
                });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Récupération de l'intégralité des livres
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