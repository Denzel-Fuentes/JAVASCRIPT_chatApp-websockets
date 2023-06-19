const { default: mongoose } = require('mongoose');
const { ObjectId } = mongoose.Types;
const Mensaje = require('../models/mensajes.js');

process.on('message', async (data) => {
  console.log(data);
const remitenteId = new ObjectId(data.id_db);
const destinatarioId = new ObjectId(data.id_db_destino);
console.log(destinatarioId);
  const mensaje = new Mensaje({
    remitente: remitenteId,
    destinatario: destinatarioId,
    contenido: data.message
  });

  const newMensaje = await mensaje.save();
  console.log(newMensaje);
});
/* {
    message: '12',
    id_db: '648f56af605aa4a39199486e',
    id_socket_destino: 'QGsg72x0gwkUy9_NAAAH',
    id_db_destino: '648f2b308972c9002b44e8f5'
 */