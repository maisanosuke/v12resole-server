const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: {type: String, required: true},//session ID
    purchaseNumber: {type: Number, required: true},
    created: {type: Date, required: true},
    status: {type: String, default: 'proccessing', enum: ['proccessing', 'shipped', 'delivered', 'returned']},//order status
    subTotal: {type: Number, required: true,min: [0, 'subTotal must be positive!']},
    tax: {type: Number, default: 0, min: [0, 'tax must be positive!']},
    shippingFee: {type: Number, default: 0, min: [0, 'shipping must be positive!']},
    total: {type: Number, required: true,min: [0, 'total must be positive!']}, //total $ amount
    items: {type: [
        {
            id: {type: Number, required: true},
            count: {type: Number, required: true, min: [0, 'Quantity must be positive!']},
        }
    ], required: true},//static item
    shippingAddress: {
        street: {type: String},
        street2: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: Number},
    },
    paymentInfo: {
        billingAddress:{
            line1: {type: String},
            line2: {type: String},
            city: {type: String, required: true},
            state: {type: String, required: true},
            postal_code: {type: Number, required: true},
            country: {type: String, require: true}
        },
        last4Degit: {type: Number}
    }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;