const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // pluggin qui empèche un meme utilisateur d'avoir plusieurs comptes 

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // le pluggin est appliqué au schema 

module.exports = mongoose.model('User', userSchema);