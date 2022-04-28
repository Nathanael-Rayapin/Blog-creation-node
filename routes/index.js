var express = require('express');
const articleController = require('../controllers/article.controller');
const multerConfig = require('../middlewares/multer.config');
const articleValidator = require('../middlewares/validators/article.validator');
var router = express.Router();


// Récupérer le chemin vers tout les articles
router.get('/', articleController.listArticle);

// Récupérer le chemin vers un article
router.get('/article/:id', articleController.showArticle);

// Récupérer le chemin vers le formuaire
router.get('/add-article', articleController.addArticle);

// Modifier un article
router.get('/edit-article/:id', articleController.editArticle);;

// Poster un article via le formumaire
router.post('/add-article', multerConfig, articleValidator, articleController.addOneArticle);

// Valider la modification de l'article
router.post('/edit-article/:id', multerConfig, articleController.editOneArticle);



module.exports = router;
