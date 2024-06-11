const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { upload, imageProcessingMiddleware } = require('../middleware/multer-config'); // traitement des images 
const stuffCtrl = require('../controllers/book');

router.get('/', stuffCtrl.getAllBook); // récupération de tout les livres 
router.post('/', auth, upload.single('image'), imageProcessingMiddleware, stuffCtrl.createBook); // création d'un nouveau livre 
router.get('/bestrating', stuffCtrl.getBestRatedBooks); // récupération du top 3 livres les mieux notés 
router.get('/:id', stuffCtrl.getOneBook); // récupération d'un livre pas son id 
router.put('/:id', auth, upload.single('image'), imageProcessingMiddleware, stuffCtrl.modifyBook); // modification d'un livre par son ID
router.delete('/:id', auth, stuffCtrl.deleteBook); // supression par l'id 
router.post('/:id/rating', auth, stuffCtrl.rateBook); // ajout d'une note à un livre 

module.exports = router;