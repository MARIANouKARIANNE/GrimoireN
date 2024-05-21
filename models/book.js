const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({

  title: { type: String, required: true },
  auteur: { type: String, required: true },
  imageUrl: { type: String, required: true },
  thème: { type: String, required: true },
  année: { type: Number, required: true },
  note :{ type: Number, required: true },
});

module.exports = mongoose.model('Book', bookSchema);