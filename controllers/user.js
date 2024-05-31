const bcrypt = require ('bcrypt') // import bibliothèque pour le hachage mdp
const User = require("../models/User"); // modèle mongoose pour la création des utilisateurs facilite les opération CRUD 
const jwt = require('jsonwebtoken'); // bibliothèque pour les token JSON

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 10 tours pour le mot de passe 
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash // mdp haché 
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error })); // erreur sauvegarde 
      })
      .catch(error => res.status(500).json({ error })); // erreur hachage du mot de passe 
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // recherhce de l'utilisateur à partir du mail 
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'problème concernant le mot de passe ou le mail' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'problème concernant le mot de passe ou le mail' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, // données encodé dans le token 
                            'RANDOM_TOKEN_SECRET', // clé secrète 
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // erreur mdp 
        })
        .catch(error => res.status(500).json({ error })); // ereur recherche utilisateur 
 };