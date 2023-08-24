const Mensaje = require('../models/mensajes');

async function getMensajes(req, res) {
  const { remitente, destinatario } = req.body;
  try {
    const mensajes = await Mensaje.find({
      $or: [
        { remitente: remitente, destinatario: destinatario },
        { remitente: destinatario, destinatario: remitente }
      ]
    }).sort({ fecha: 1 });
    
    res.json(mensajes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

module.exports = {
  getMensajes
};