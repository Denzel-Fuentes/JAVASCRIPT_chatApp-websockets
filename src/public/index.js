class ChatApp {
    constructor() {
      this.usuariosConectados = [];
      this.mensajes = $(".chat-messages");
      this.estado = $('.escribiendo');
      this.user = $('.user');
      this.tiempo = new Date();
      this.id = 0;
      this.nombre = $('.nameUser').text();
      this.idObjet = $('.id').text();
      this.socket = null;
    }
  
    iniciarSesion() {
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem(this.idObjet);
      });
  
      if (localStorage.getItem(this.idObjet)) {
        $('.texto-eslogan').text('ya tienes una sesion abierta');
      } else {
        this.socket = io();
      }
  
      this.socket.on('connect', () => {
        const socketId = this.socket.id;
        console.log("Socket ID:", socketId);
        localStorage.setItem(this.idObjet, socketId);
        this.socket.emit('chat:conectar', {
          nombre: this.nombre,
          id_db: this.idObjet,
          id_socket: socketId
        });
      });
  
      $(".caja-mensaje").keypress((event) => {
        this.socket.emit('chat:typing', {
          msg: "escribiendo",
          id_socket_destino: this.id
        });
      });
  
      $(".btnEnviar").click(() => {
        this.socket.emit('chat:message', {
          message: $(".caja-mensaje").val(),
          id_db: this.idObjet,
          id_socket_destino: this.id,
          id_db_destino: this.buscarObjetoPorIdSocket(this.id).id_db,
          hora: this.tiempo.getHours(),
          minutos: this.tiempo.getMinutes(),
          id_socket: this.socket.id
        });
  
        this.mostrarMensaje($(".caja-mensaje").val(), this.tiempo.getHours(), this.tiempo.getMinutes(), 'right');
      });
  
      this.socket.on('chat:message', (data) => {
        console.log(data);
        if (this.id === data.id_socket) {
          this.mostrarMensaje(data.message, this.tiempo.getHours(), this.tiempo.getMinutes(), 'left');
        } else {
          let cantidad = parseInt($('.' + data.id_socket).find('.badge').text()) || 0;
          console.log(cantidad);
          $('.' + data.id_socket).find('.badge').text(cantidad + 1);
        }
      });
  
      this.socket.on('chat:typing', (data) => {
        console.log(data);
        setTimeout(() => {
          this.estado.text('');
        }, 1000);
        this.estado.text('Escribiendo...');
      });
  
      this.socket.on('chat:conectado', (data) => {
        this.usuariosConectados.push(data);
        $('.contactos').append(`
          <li class="nav-item ${data.id_socket}" onclick="chatApp.declararDestinatario('${data.id_socket}','${data.nombre}')">
            <div href="#" class="contact nav-link text-white px-0">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSd84GiQrWrjUWZGHsC3IPr2Lk2E7P5x84cXA&usqp=CAU"
                width="70" class="img-fluid rounded-circle" style="margin-right: 15px;margin-left: 15px;"
                alt="Descripción de la imagen">
              ${data.nombre}
              <span class="badge badge-primary badge-pill alert-N"></span>
            </div>
          </li>
        `);
  
        if (data.datosCompartidos) return;
  
        this.socket.emit('chat:infoPersonal', {
          nombre: this.nombre,
          id_socket_destino: data.id_socket,
          datosCompartidos: true,
          id_socket: this.socket.id,
          id_db: this.idObjet
        });
      });
  
      this.socket.on('chat:userDisconnected', (data) => {
        $('.' + data.id_socket).remove();
        let index = this.usuariosConectados.findIndex(user => user.id_socket === data.id_socket);
        if (index !== -1) this.usuariosConectados.splice(index, 1);
      });
    }
  
    mostrarMensaje(contenido, hora, minutos, float) {
      this.mensajes.append(`
        <div class="chat-message-${float} pb-4">
          <div> 
            <div class="text-muted small text-nowrap mt-2">${hora}:${minutos}</div>
          </div>
          <div class="flex-shrink-1 rounded py-2 px-3 ml-3 text-color">
            ${contenido}
          </div>
        </div>
      `);
  
      this.mensajes.scrollTop(this.mensajes[0].scrollHeight);
    }
  
    buscarObjetoPorIdSocket(idSocket) {
      return this.usuariosConectados.find(objeto => objeto.id_socket === idSocket);
    }
  
    declararDestinatario(id_socket, nombre) {
      $('.info-contacto-destino').css('visibility', 'visible');
      $('.present').css('display', 'none');
      this.user.text(nombre);
      this.mensajes.empty();
      $('.' + id_socket).find('.badge').empty();
      this.id = id_socket;
      let destinatario = this.usuariosConectados.find(objeto => objeto.id_socket === id_socket).id_db;
      let remitente = this.idObjet;
  
      const path = (window.location.hostname == 'localhost') ? false : 'https://' + window.location.hostname + '/mensajes';
  
      fetch((path) ? path : 'http://localhost:3000/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remitente, destinatario })
      })
      .then(response => response.json())
      .then(data => {
        data.forEach((element) => {
          let { contenido, destinatario, hora, minutos, remitente } = element;
          if (remitente == this.idObjet) {
            this.mostrarMensaje(contenido, hora, minutos, 'right');
          } else {
            this.mostrarMensaje(contenido, hora, minutos, 'left');
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
  
  const chatApp = new ChatApp();
  chatApp.iniciarSesion();
  
   