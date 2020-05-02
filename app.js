const express = require('express');
const app = express();
const path = require('path');
global.appRoot = path.resolve(__dirname);
var mongoose = require('mongoose');
var dbConfig = require('./config/database');
var home = require('./routers/home');
var contact = require('./routers/contact');
var about = require('./routers/about');
var tours = require('./routers/tours');
var categories = require('./routers/categories');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var authRoutes = require('./routers/auth');
var files = require('./routers/files');
var mail = require('./routers/mail');
var displays = require('./routers/displays');
var panel = require('./routers/panel');
var destinations = require('./routers/destinations');
var displayService  = require('./services/displayService');
displayService.update({destinations:"All Destinations",alltours:"All Tours"}).then(function(res){
}).catch(function(err){
 
});


mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.localUrl, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

mongoose.set('useFindAndModify', false);

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));


// required for passport
app.use(session({
  secret: 'eminem', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var utils = require("./utils.js");


const exphbs = require('express-handlebars');



app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: utils.getHandleBarsHelpers()
}));


app.use(flash());
app.set('view engine', 'handlebars');
var authRoutes = require('./routers/auth');

app.use(express.static(path.join(appRoot, 'public')));
app.use('/:smth', express.static(path.join(appRoot, 'public')));
app.use('/:smth/:h', express.static(path.join(appRoot, 'public')));


app.use('/', home);
app.use('/contact', contact);
app.use('/tours', tours);
app.use('/about', about);
app.use('/categories', categories);
app.use('/auth', authRoutes);
app.use('/panel', panel);
app.use('/mail', mail);
app.use('/files', files);
app.use('/destinations', destinations);
app.use('/displays', displays);


app.get('/*', function (req, res) {
  res.redirect('/');
});


var server = app.listen(process.env.port || 3000);

server.on('connection', function (socket) {
  //console.log("connected");
  socket.setTimeout(600 * 20000);
});

console.log('Running at Port 3000');