const { Schema, model } = require('mongoose');

//Definición del modelo User
const UserShema = Schema( {
    catalog_role_id: {
        type: String,
        required: true,
        //enum: ['ADMIN', 'SELLER', 'DELIVERY', 'CUSTOMER']     //Se valida contra la BD
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
    },
    paternal_last_name: {
        type: String,
        trim: true,
    },
    maternal_last_name: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    level: {
        type: String,
        default: 'BASIC',
        enum: ['BASIC', 'PREMIUM']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'La constraseña es obligatoria']
    },
    img: {
        type: String,
    },
    status: {
        type: String,
        default: "ACTIVO",
        enum: ['ACTIVO', 'INACTIVO']
    },
    is_auth_google: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
});

//Sobre-escribimos el formato de salida JSON de un objeto de este Modelo
UserShema.methods.toJSON = function() {
    const { __v, password, _id, ...userResponse } = this.toObject();
    
    //En la BD si se usa _id, pero para la respuesta visualmente es uid
    userResponse.uid = _id;
    return userResponse;
}

//El modelo estará disponible bajo el nombre User
module.exports = model('User', UserShema);