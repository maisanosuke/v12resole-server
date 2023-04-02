const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    //use SKU for _id as it has to be unique
    id: {type: Number, required: true},
    price: {type: Number, required: [true, 'price is required'], min: [0, 'Price must be Positive!']},
    price_id: {type: String, required: true},
    onSale: {type: Boolean, default: false},
    detail: {type: String, required: [true, 'detail is required'],},
    inventory: {type: Number, min: [0, "Quantity must be Positive!"]},
    category: {type: [String]},
    imgUrl: {type: [String]},
    shipping_details: {
        weight: {type: Number},
        width: {type: Number},
        height: {type: Number},
        depth: {type: Number}
    },

})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;