var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
/* GET página de inicio. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bienvenido a quiz' });
});

//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer',   quizController.answer);

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/authors',   quizController.authors);//+++

module.exports = router;
