const { Router } = require('express');
const router = Router();
const mensajeController = require('../controller/controller.mensajes');

router.post('/mensajes', mensajeController.getMensajes);

module.exports = router;
