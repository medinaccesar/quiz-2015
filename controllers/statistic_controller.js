var models = require('../models/models.js');
//GET /quizes/statistics
exports.index = function(req, res) {	
  
  models.Quiz.findAll({            
           include: [{model: models.Comment}] 
   }).then(function(quizes) {  

      if (quizes) {
		var statistics = {
			n_preguntas  : 0,
	   		n_comentarios : 0,
	   		media_comentarios_pregunta : 0,
	   		n_preguntas_sin_comentarios : 0,
	   		n_preguntas_con_comentarios : 0
		}
      	statistics.n_preguntas= quizes.length;   
        if(quizes.Comments) statistics.n_comentarios = quizes.Comments.length;        

        for(var i in quizes){
        	statistics.n_comentarios+=quizes[i].Comments.length;
        	if(quizes[i].Comments.length>0)
        		statistics.n_preguntas_con_comentarios++;
        }
		statistics.n_preguntas_sin_comentarios = statistics.n_preguntas-statistics.n_preguntas_con_comentarios;
        statistics.media_comentarios_pregunta= (statistics.n_comentarios/statistics.n_preguntas).toFixed(2).toString().replace(/\./g,',');

        res.render('quizes/statistics', { statistics: statistics, errors: []});

      } else  next(new Error('No existen datos'));

    }
  ).catch(function(error) { next(error);});
  

};