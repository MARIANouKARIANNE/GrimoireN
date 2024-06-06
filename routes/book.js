const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/book');

router.get('/', stuffCtrl.getAllBook); // récupération de tout les livres
router.post('/', auth, multer, stuffCtrl.createBook); // création d'un nouveau livre 
router.get('/bestrating', stuffCtrl.getBestRatedBooks); // récupération du top 3 livre
router.get('/:id', stuffCtrl.getOneBook); // récupération d'un livre par son id 
router.put('/:id', auth, multer, stuffCtrl.modifyBook); // modification d'un livre par son id 
router.delete('/:id', auth, stuffCtrl.deleteBook); // supprime un livre par id 
router.post('/:id/rating', auth, stuffCtrl.rateBook); // ajout d'une note à un livre par son id 

module.exports = router;