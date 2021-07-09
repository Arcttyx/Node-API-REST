const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//Como el toString, pero para objetos
CategorySchema.methods.toJSON = function() {
    const { __v, status, ...categoryResponse } = this.toObject();

    return categoryResponse;
}

module.exports = model('Category', CategorySchema);