const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

router.get('/', stuffCtrl.getAllBook);
router.post('/', stuffCtrl.createBook);
router.get('/:id', stuffCtrl.getOneBook);
router.put('/:id', stuffCtrl.modifyBook);
router.delete('/:id', stuffCtrl.deleteBook);

module.exports = router;