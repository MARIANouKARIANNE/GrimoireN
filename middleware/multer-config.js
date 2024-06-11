const multer = require('multer'); // gestion des fichier multipart
const path = require('path');
const sharp = require('sharp');
const fs = require('fs'); // gestion fichier système 

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    // vérification des fichiers autorisés 
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Seuls les fichiers JPEG, JPG et PNG sont autorisés.'));
    }
    callback(null, true);
  }
});
// Middleware pour le traitement des images 
const imageProcessingMiddleware = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // génération d'un nom pour le fichier ( le livre ) unique 
    const filename = Date.now() + '-' + req.file.originalname;
    const processedImagePath = path.join('images', filename);
// réduction de la taille avec sharp 
    await sharp(req.file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(processedImagePath);

    req.file.filename = filename;
    req.file.path = processedImagePath;
    
    next();
  } catch (error) {
    next(error);
  }
};
// export de multer et du traitement pour la réduction d'image 
module.exports = { upload, imageProcessingMiddleware };