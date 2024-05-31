const express = require('express');
const router = express.Router(); // création d'un routeur express pour définir les routes de l'application 
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;