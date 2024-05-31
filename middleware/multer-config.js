const multer = require('multer'); // Middleware qui gére les fichiers form data ( va nous servir pour des uppload ) 

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}; // formats acceptés

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');// les espaces deviennent des tirets du bas 
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); // nom finale 
  }
});

module.exports = multer({storage: storage}).single('image');
