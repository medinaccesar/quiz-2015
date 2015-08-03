// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  // return sequelize.define('Quiz',
  //           { pregunta:  DataTypes.STRING,
  //             respuesta: DataTypes.STRING,
  //           });
  var enumeracion=['otro', 'humanidades','ocio','ciencia','tecnologia'];
  return sequelize.define('Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta la pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta la respuesta"}}
      },
      categoria: {
        type: DataTypes.ENUM(enumeracion),
        validate: { isIn: {
                           args: [enumeracion],
                           msg: "-> La categoría debe ser una de las permitidas: "+enumeracion.toString()
                          }
                  }
      }
    }
  );
}