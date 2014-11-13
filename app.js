var express       = require('express'),
    app           = express(),
    path          = require('path'),
    favicon       = require('static-favicon'),
    logger        = require('morgan'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    session       = require('express-session'),
    RedisStore    = require('connect-redis')(session),
    passport      = require('passport'),
    hbs           = require('hbs'),
    mysql         = require('mysql'),
    validator     = require('express-validator');


global.appDir  = __dirname;

app.use(favicon());
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ store: new RedisStore({}), secret: 'm9889MJHAI7nlfds8n77w37', cookie: { maxAge : 14515200 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(validator([]));

app.use(function(req, res, next) {
  if (req.user) {
    res.locals.isAuth = true;
    res.locals.user   = req.user;
  }

  global.options = {};
  res.locals.options = options;
  
  if (app.get('env') === 'development') {
    options.root_url = 'http://local.mee.la:3000/';
  } 

  if (app.get('env') === 'production') {
    options.root_url = 'http://178.62.8.5:3000/';
  } 
  


  return next();
});



// view engine setup (HBS Setup / Helpers)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
hbs.registerPartials(__dirname + '/views/inc');
hbs.registerHelper('ifAnd', function (v1, v2, options) {
  if (v1 && v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
// hbs.registerHelper('ifCond', function (v1, v2, options) {
//   if (v1 === v2) {
//     return options.fn(this);
//   }
//   return options.inverse(this);
// });

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


// MySQL

if (app.get('env') === 'development') {
  global.db = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'AlexPhotoProject',
  });
  db.connect();
} 

if (app.get('env') === 'production') {
  global.db = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '3306',
    user     : 'root',
    password : 'Spectrum312',
    database : 'AlexPhotoProject',
  });
  db.connect();


} 
  
var incPass = require('./inc/passport');
incPass.passportAuth(app);





app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/forgot', require('./routes/forgot'));
app.use('/steptwo', require('./routes/steptwo'));
app.use('/upload', require('./routes/upload'));
app.use('/set', require('./routes/set'));
app.use('/picture', require('./routes/picture'));
app.use('/picture', require('./routes/edit_picture'));
app.use('/logout', require('./routes/logout'));
app.use('/settings', require('./routes/settings'));
// app.use('/ad', ad);
app.use('/', require('./routes/profile'));





/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


