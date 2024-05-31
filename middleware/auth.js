const jwt = require('jsonwebtoken'); // bibliothèque pour les tokens JSON 
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // exttraction du token 
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // vérification du token 
       const userId = decodedToken.userId; // récupération de l'id utilisateur à partir du token décodé 
       req.auth = {
           userId: userId
       };
	next(); // passage au middleware suivant 
   } catch(error) {
       res.status(401).json({ error }); // si pas de token erreur 401
   }
};