const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const Database = require('./database');
const socketChat = require('./socket');
require('./passport/local-auth');

class App {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.session;
  }

  configure() {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.engine('ejs', engine);
    this.app.set('view engine', 'ejs');
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.use(express.urlencoded({ extended: false }));
    this.session= session({
      secret: 'shinmegamitensei3',
      resave: false,
      saveUninitialized: false
    })
    this.app.use(this.session);
    this.app.use(flash());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use((req, res, next) => {
      this.app.locals.signupMessage = req.flash('signupMessage');
      this.app.locals.signinMessage = req.flash('signinMessage');
      next();
    });
    this.app.use(require('./routes/index'));
    this.app.use(require('./routes/mensajes'))
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });

    // Instancia de ChatSocket y pasa el servidor http
     new socketChat(this.server,this.session);
  }
}

const app = new App();
const db = new Database();
db.connect();
app.configure();
app.start();
