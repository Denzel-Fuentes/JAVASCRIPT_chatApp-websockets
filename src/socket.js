const SocketIO = require("socket.io");
const sharedSession = require('express-socket.io-session')
class ChatSocket {
  #io;

  constructor(server,sesion) {
    this.#io = SocketIO(server);
    this.#io.on('connection', this.handleConnection.bind(this));
    this.#io.use(sharedSession(sesion,{
      autoSave:true
    }));
  }

  handleConnection(socket) {
    console.log("New connection", socket.id);
    socket.on("chat:conectar", this.newUserConnect.bind(this,socket))
    socket.on("chat:message", this.handleChatMessage.bind(this, socket));
    socket.on("chat:typing", this.handleChatTyping.bind(this, socket));
    socket.on("disconnect", () => {this.handleDisconnect(socket);});
  }

  handleChatMessage(socket, data) {
    console.log(data.id_socket);
    this.#io.to(data.id_socket).emit("chat:message", data);
  }

  handleChatTyping(socket, data) {
    socket.broadcast.emit("chat:typing", data);
  }
  newUserConnect(socket,data) {
    console.log(data);
    console.log("entro a la funcion")
    // Enviar mensaje de nhauevo usuario conectado a todos los usuarios

    const message = socket.id;
    socket.broadcast.emit("chat:conectado", { id: message,nombre:data.name });
  }
  handleDisconnect(socket) {
    console.log("User disconnected", socket.id);

    // Enviar mensaje de usuario desconectado a todos los clientes
    const message = "El usuario se ha desconectado";
    this.#io.sockets.emit("chat:userDisconnected", {message,id:socket.id});
  }
  //chat:enviarUsuario
  UserConnect(socket,data) {
    console.log(data);
    this.#io.to(data.id_socket).emit("chat:conectado", data);
  }
}

module.exports = ChatSocket;
