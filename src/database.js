const mongoose = require('mongoose');
const {mongodb} = require('./keys')


mongoose.connect(mongodb.URI,{})
    .then(db => console.log('Se ha conectado a la base de datos'))
    .catch(err => console.error(err));