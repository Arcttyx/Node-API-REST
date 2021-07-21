const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

//El modelo estará disponible bajo el nombre Role
module.exports = model( 'Role', RoleSchema );