const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const Database = require('./config/database');
const socketChat = require('./config/socket');
const Mensaje = require('./models/mensajes.js');
const { default: mongoose } = require('mongoose');
const { ObjectId } = mongoose.Types;
require('./passport/local-auth');

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
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

    const redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD
    });
    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });
    
    redisClient.on('error', (error) => {
      console.error('Error connecting to Redis:', error);
    });

    this.session = session({
      secret: 'shinmegamitensei3',
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient })
    });

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
    this.app.use(require('./routes/mensajes'));
  }

  start() {
    const saveMessage = {
      async update(event,data){
        const remitenteId = new ObjectId(data.id_db);
        const destinatarioId = new ObjectId(data.id_db_destino);
        const mensaje = new Mensaje({
          remitente: remitenteId,
          destinatario: destinatarioId,
          contenido: data.message,
          hora:data.hora,
          minutos:data.minutos
        });
        const newMensaje = await mensaje.save();
        console.log(newMensaje);
      }
    }
    this.server = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
    
    // Instancia de ChatSocket y pasa el servidor http y la sesión
    const chatSocket = new socketChat(this.server, this.session);
    chatSocket.subscribe(saveMessage);
  }
}

const app = new App();
const dbInstance = Database.getInstance();
dbInstance.connect();
app.configure();
app.start();
