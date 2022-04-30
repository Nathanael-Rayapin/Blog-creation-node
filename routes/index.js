var express = require('express');
const articleController = require('../controllers/article.controller');
const categoryController = require('../controllers/category.controller');
const multerConfig = require('../middlewares/multer.config');
const articleValidator = require('../middlewares/validators/article.validator');
const { guard } = require('../middlewares/guard');
const categoryValidator = require('../middlewares/validators/category.validator');
var router = express.Router();


// Récupérer le chemin vers tout les articles
router.get('/', articleController.listArticle);

// Récupérer le chemin vers un article
router.get('/article/:id', articleController.showArticle);

// Récupérer le chemin vers le formuaire
router.get('/add-article', guard, articleController.addArticle);

// Modifier un article
router.get('/edit-article/:id', guard, articleController.editArticle);

// Poster un article via le formumaire
router.post('/add-article', multerConfig, articleValidator, guard, articleController.addOneArticle);

// Valider la modification de l'article
router.post('/edit-article/:id', multerConfig, guard, articleController.editOneArticle);

// Supprimer un article
router.get('/delete-article/:id', guard, articleController.deleteArticle);

// Récupérer une category
router.get('/add-category', guard, (req, res) => {
    res.render('add-category');
})

// Ajouter une category
router.post('/add-category', guard, categoryValidator, categoryController.addCategory);


module.exports = router;
