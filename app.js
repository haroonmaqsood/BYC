var express       = require('express'),
    path          = require('path'),
    favicon       = require('static-favicon'),
    logger        = require('morgan'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    // flash         = require('connect-flash'),
    session       = require('express-session'),
    RedisStore    = require('connect-redis')(session),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt        = require('bcrypt-nodejs'),
    hbs           = require('hbs');

var app = express();


var index     = require('./routes/index'),
    login     = require('./routes/login'),
    signup    = require('./routes/signup'),
    logout    = require('./routes/logout'),
    profile   = require('./routes/profile'),
    picture   = require('./routes/picture'),
    upload    = require('./routes/upload');

// var debug     = require('express-debug')(app, {/* settings */});
// console.log(debug);
// var User  = require('./models/User');


// view engine setup



app.use(favicon());
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ store: new RedisStore({}), secret: 'm9889MJHAI7nlfds8n77w37', cookie: { maxAge : 14515200 } }));
// app.use(session({ secret: 'm9889MJHAI7nlfds8n77w37' }));
app.use(passport.initialize());
app.use(passport.session());

// app.use(flash()); // to be replaced by redis

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());





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
var mysql      = require('mysql');
global.db  = mysql.createConnection({
  host     : '127.0.0.1',
  port     : '8889',
  user     : 'root',
  password : 'root',
  database : 'AlexPhotoProject',
});

db.connect();



// db.query('SELECT * from users', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows);
// });



 
passport.use(new LocalStrategy(
  function(username, password, done) {
    return check_auth_user(username,password,done);
  } 
));
 

passport.serializeUser(function(res, done) {
  done(null,res);
});

passport.deserializeUser(function(res, done) {
  done(null,res);
});


function check_auth_user(username,password,done,public_id){


  // var sql="SELECT * FROM users WHERE email = '"+ username +"' and password = '"+ password +"' limit 1";
  // console.log(sql);
  

  db.query("SELECT * FROM users WHERE email = ? limit 1", [username], function (err,results) {

    if (err) throw err;

    if(results.length > 0){

        var res=results[0]; 
        // console.log(res.password);
        // var hash = bcrypt.hashSync("1q2w3e4r");
        // db.query("UPDATE users SET password = ? WHERE email = 'mail@suf.io'", [hash], function (err,results) {});

        if (!bcrypt.compareSync(password, res.password)) {
          console.log('fail 1');
          return done(null, false);
        };

        //serialize the query result save whole data as session in req.user[] array  
        passport.serializeUser(function(res, done) {
          console.log('success 1');
          done(null,res);
        });

        passport.deserializeUser(function(id, done) {
          console.log('success 2');
          done(null,res);
        });
        //console.log(JSON.stringify(results));
        //console.log(results[0]['member_id']);
        return done(null, res);

    } else {
      console.log('fail 2');
      return done(null, false); 

    }

  });


  // db.query(sql, function (err,results) {

  //   if (err) throw err;

  //   if(results.length > 0){

  //       var res=results[0]; 
  //       //serialize the query result save whole data as session in req.user[] array  
  //       passport.serializeUser(function(res, done) {
  //           done(null,res);
  //       });

  //       passport.deserializeUser(function(id, done) {
  //           done(null,res);
  //       });
  //       //console.log(JSON.stringify(results));
  //       //console.log(results[0]['member_id']);
  //       return done(null, res);

  //   } else {

  //     return done(null, false); 

  //   }

  // });
 
}



app.use('/', index);
app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);



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


