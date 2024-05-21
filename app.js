const express = require('express');
const bookRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://MarianneC:R*LMx7La3q$7rwD@cluster0.hihdgki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();

app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;