const mongoose = require('mongoose')
const { Schema } = mongoose;

const mensajeSchema = new Schema({
    remitente:{
        type:String,
        ref:'usuarios',
    },
    destinatario:{
        type:mongoose.Schema.Types.ObjectId,  
        ref:'usuarios',
    },
    contenido : String,
    fecha:{
        type:Date,
        default:Date.now
    }
    
});


module.exports = mongoose.model('mensaje',mensajeSchema)