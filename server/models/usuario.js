const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROL', 'USER_ROL', 'SUPER_ROL'],
    message: '{VALUE} no es un rol valido'
}
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'el nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'el correo es requerido']
    },
    password: {
        type: String,
        require: [true, 'la contrasenia es requerido']
    },
    img: {
        type: String,
        require: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { mensagge: '{ PHAT }debe de ser Unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);