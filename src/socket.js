const SocketIO = require("socket.io");
const sharedSession = require('express-socket.io-session')
const Mensaje = require('./models/mensajes');
const path = require('path');

const saveMessagesPath = path.join(__dirname, 'procesos', 'saveMessages.js');
const { fork } = require('child_process');
const SaveMessage = fork(saveMessagesPath);
const { default: mongoose } = require('mongoose');
const { ObjectId } = mongoose.Types;
class ChatSocket {
  #io;
  #socketMap;
  #Mensaje = require('./models/mensajes.js');

  constructor(server, sesion) {
    this.#io = SocketIO(server);
    this.#io.on('connection', this.handleConnection.bind(this));
    this.#io.use(sharedSession(sesion, {
      autoSave: true
    }));
  }

  handleConnection(socket) {
    console.log("New connection", socket.id);

    socket.on("chat:conectar", this.newUserConnect.bind(this, socket));
    socket.on('chat:infoPersonal', this.handleShareInfo.bind(this, socket));
    socket.on("chat:message", this.handleChatMessage.bind(this, socket));
    socket.on("chat:typing", this.handleChatTyping.bind(this, socket));
    socket.on("disconnect", () => { this.handleDisconnect(socket); });

  }

  async handleChatMessage(socket, data) {

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
    this.#io.to(data.id_socket_destino).emit("chat:message", data);
  }

  handleChatTyping(socket, data) {
    //envia infromacion si alguien esta escribiendo
    //si
    this.#io.to(data.id_socket_destino).emit("chat:typing", data);

  }
  newUserConnect(socket, data) {
    //console.log(data);
    // Enviar mensaje de nhauevo usuario conectado a todos los usuarios
    socket.broadcast.emit("chat:conectado", data);
  }
  handleShareInfo(socket, data) {
    //console.log(data);
    this.#io.to(data.id_socket_destino).emit("chat:conectado", data);

  }
  handleDisconnect(socket) {
    console.log("User disconnected", socket.id);

    // Enviar mensaje de usuario desconectado a todos los clientes
    const message = "El usuario se ha desconectado";
    this.#io.sockets.emit("chat:userDisconnected", { message, id_socket: socket.id });
  }

}

module.exports = ChatSocket;
