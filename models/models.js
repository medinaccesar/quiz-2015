var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name		=	(url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Usar BBDD SQLite:
//var sequelize = new Sequelize(null, null, null, 
//                       {dialect: "sqlite", storage: "quiz.sqlite"}
//                    );

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Importar definición de la tabla user
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);
// los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

// exportar tablas
exports.User = User;


exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  User.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      User.bulkCreate( 
        [ {username: 'admin',   password: '1234', isAdmin: true},
          {username: 'pepe',   password: '5678'} // el valor por defecto de isAdmin es 'false'
        ]
      ).then(function(){
        console.log('Base de datos (tabla user) inicializada');
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
          //Se pueden añadir preguntas y respuestas por partes para inicializar la tabla	
            // Quiz.create({ pregunta: 'Capital de Italia',
            // 	            respuesta: 'Roma', UserId: 2
            // 	         });
            // Quiz.create({ pregunta: 'Capital de Portugal',
            // 	            respuesta: 'Lisboa', UserId: 2
            // 	         })
            // o mejor hacerlo añadirlas en bloque
            Quiz.bulkCreate( 
              [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', categoria: 'humanidades', UserId: 2},
                {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', categoria: 'humanidades', UserId: 2}
              ]
            )
            .then(function(){console.log('Base de datos inicializada')});
          }//fin if
        });//fin quiz.count.then
      });//fin User.BulkCreate.then
    }//fin if
  });//fin User.count.then

});//fin sequelize.sync().then
