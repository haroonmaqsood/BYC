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
    LocalStrategy = require('passport-local').Strategy,
    bcrypt        = require('bcrypt-nodejs'),
    hbs           = require('hbs');



var index         = require('./routes/index'),
    login         = require('./routes/login'),
    signup        = require('./routes/signup'),
    stepTwo       = require('./routes/steptwo'),
    logout        = require('./routes/logout'),
    profile       = require('./routes/profile'),
    picture       = require('./routes/picture'),
    edit_picture  = require('./routes/edit_picture');
    upload        = require('./routes/upload'),


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


app.use(function(req, res, next) {
  // console.log(req.user);

  if (req.user) {
    res.locals.isAuth = true;
    res.locals.user   = req.user;
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
hbs.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});


// MySQL
var mysql = require('mysql');
global.db = mysql.createConnection({
  host     : '127.0.0.1',
  port     : '8889',
  user     : 'root',
  password : 'root',
  database : 'AlexPhotoProject',
});

db.connect();

var incPass = require('./inc/passport');
incPass.funcTest(app);


app.use('/', index);
app.use('/login', login);
app.use('/signup', signup);
app.use('/steptwo', stepTwo);
app.use('/picture', edit_picture);
app.use('/upload', upload);
app.use('/upload', upload);
app.use('/logout', logout);
app.use('/', profile);




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


