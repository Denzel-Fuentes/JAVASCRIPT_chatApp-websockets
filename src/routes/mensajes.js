const { Router } = require('express');
const Mensaje = require('../models/mensajes');
const router = Router();


router.post('/mensajes',async (req,res)=>{
    const { remitente,destinatario } = req.body;
    Mensaje.find({
        $or: [
          { remitente: remitente, destinatario: destinatario },
          { remitente: destinatario, destinatario: remitente }
        ]
      })
        .sort({ fecha: 1 }) // Orden ascendente por el campo de fecha
        .then((mensajes) => {
          res.json(mensajes);
        })
        .catch((err) => {
          console.error(err);
          // Manejar el error adecuadamente
          res.status(500).json({ error: 'Error en el servidor' });
        });
})
module.exports = router 