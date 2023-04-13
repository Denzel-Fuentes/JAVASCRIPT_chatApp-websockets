const express = require('express');
const engine = require('ejs-mate')
const path = require('path');
const morgan = require('morgan');
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
//  Inicializar
const app = express();
require('./database')
require('./passport/local-auth')


//Configuraciones
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.json());

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'shinmegamitensei3',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) =>{
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.signinMessage = req.flash('signinMessage');
  next();
})
app.use(require('./routes/index'))


//app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/',require('./routes/index'));

app.listen(3000, () =>{
    console.log('Server on port 3000')
});