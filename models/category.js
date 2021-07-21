const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
});

//Sobre-escribimos el formato de salida JSON de un objeto de este Modelo
CategorySchema.methods.toJSON = function() {
    const { __v, status, ...categoryResponse } = this.toObject();

    return categoryResponse;
}

//El modelo estará disponible bajo el nombre Category
module.exports = model('Category', CategorySchema);