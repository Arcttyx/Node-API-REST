const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    catalog_product_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
        unique: true,
        trim: true,
        uniqueCaseInsensitive: true
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0.0,
    },
    discount: {
        type: Number,
        default: 0.0,
    },
    status: {
        type: String,
        default: 'DISPONIBLE'
    },
    unit_type: {
        type: String,
        required: [true, 'La unidad es obligatoria'],
        default: 'UNIDAD'
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
ProductSchema.methods.toJSON = function() {
    const { __v, status, ...productResponse } = this.toObject();

    return productResponse;
}

module.exports = model( 'Product', ProductSchema );