const express = require('express');
const path = require('path');
const bookRoutes = require('./routes/book'); //importation des routes pour les livres 
const userRoutes = require('./routes/user'); 
const mongoose = require('mongoose');
 // connexion à mongoDB 
mongoose.connect('mongodb+srv://MarianneC:R*LMx7La3q$7rwD@cluster0.hihdgki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express(); // création application express 

app.use(express.json()); // Middleware pour analyser les requetes JSON

// configuration des en tete de réponsse CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
// pas de préfixe auth 
app.use('/api/books', bookRoutes);
// routes pour les utilisateurs avec le préfixe auth 
app.use('/api/auth', userRoutes);
module.exports = app;