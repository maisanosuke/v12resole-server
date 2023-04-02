const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    //use email address so it will be unique 
    _id: {type: String, required: [true, '_id cannot be blank']},
    email: {type: String, required: [true, 'Email cannot be blank'], validate: [validator.isEmail, 'Invalid Email']},
    firstName: {type: String, required: [true, 'first name cannot be blank']},
    lastName: {type: String, required: [true, 'last name cannot be blank']},
    hashedPassword: {type: String},
    billingAddress: {
        street: {type: String},
        street2: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: Number},
    },
    shippingAddress: {
        street: {type: String},
        street2: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: Number},
    },
    orders: [{type: String, ref: "Order"}] //save reference to order id
    // mongoose.Schema.Types.ObjectId
})

const User = mongoose.model('User', userSchema);
module.exports = User;