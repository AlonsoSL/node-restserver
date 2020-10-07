const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        require: [true, 'la descripcion es requerida']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

categoriaSchema.methods.toJSON = function() {

    let catgoria = this;
    let catgoriaObject = catgoria.toObject();

    return catgoriaObject;
}
categoriaSchema.plugin(uniqueValidator, { mensagge: '{ PHAT }debe de ser Unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);