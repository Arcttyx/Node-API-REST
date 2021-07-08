const { Schema, model } = require('mongoose');

const UserShema = Schema( {
    catalog_role_id: {
        type: String,
        required: true,
        //enum: ['ADMIN', 'SELLER', 'DELIVERY', 'CUSTOMER']
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    paternal_last_name: {
        type: String,
    },
    maternal_last_name: {
        type: String,
    },
    phone: {
        type: String,
    },
    level: {
        type: String,
        default: 'BASIC',
        enum: ['BASIC', 'PREMIUM']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
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

//Como el toString, pero para objetos
UserShema.methods.toJSON = function() {
    const { __v, password, ...userResponse } = this.toObject();
    return userResponse;
}

module.exports = model('User', UserShema);