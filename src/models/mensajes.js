const mongoose = require('mongoose')
const { Schema } = mongoose;

const mensajeSchema = new Schema({
    remitente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usuarios',
    },
    destinatario:{
        type:mongoose.Schema.Types.ObjectId,  
        ref:'usuarios',
    },
    contenido : String,
    hora:String,
    minutos:String,
    fecha:{
        type:Date,
        default:Date.now
    }
    
});


module.exports = mongoose.model('Mensaje',mensajeSchema)