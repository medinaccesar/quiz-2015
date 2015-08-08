var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');//---

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));//+++
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());//permite usar matrices como parámetros
//app.use(cookieParser());
app.use(cookieParser('Quiz 2015'));//el parámetro es la semilla para la cokie
app.use(session());

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

// guardar path en session.redir para despues de login
if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
 }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

//MW Se comprueba la sesión a fin de desconectar si han transcurrido más de dos min
app.use(function(req, res, next){

    if(req.session.user){ //si hay sesión
        var ahora_ml = new Date().getTime();//marca temporal actual en milisegundos
        var dos_minutos_ml = 120000;//2*60*1000 dos minutos en milisegundos

        if(req.session.user.tiempo){ // si está establecida la marca temporal «tiempo»     
            //si han pasado más de 120 segundos redireccionamos para destruir la sesión
            if(ahora_ml - res.locals.session.user.tiempo  > dos_minutos_ml){                
                res.redirect('/logout');
                //en lugar de esto, se podría haber borrado 
                //la sesión directamente y redireccionado a login
                //delete req.session.user;
                //res.redirect('/login');
            }

        }else{            
            req.session.user.tiempo = ahora_ml; //se asigna la marca temporal «tiempo»
        }     
    } 
    next();
});



app.use('/', routes);
//app.use('/users', users);//---

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
