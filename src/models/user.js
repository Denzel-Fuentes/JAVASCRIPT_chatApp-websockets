const mongoose = require('mongoose')
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs')


const userSchema = new Schema({
    name:String,
    email : String,
    password: String,
    contactos:[{
        type:mongoose.Schema.Types.ObjectId,   
        ref:'usuarios'
    }]
});

userSchema.methods.encryptPassword = (password) => {
   return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.compararContraseña = function (password) {
    return bcrypt.compareSync(password, this.password)
}


module.exports = mongoose.model('usuarios',userSchema)