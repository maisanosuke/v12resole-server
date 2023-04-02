const productsData = require('../../client/src/data/products.json');
const Order = require('../models/Order');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const AppError = require('../utils/ExpressError.js');

exports.createCheckout = async (req, res) => {
    const items = req.body;
    const products = items.map( item => {
        const foundProduct = productsData.find(product => product.id == item.id);
        return {
            price: foundProduct.price_id,
            quantity: item.count
        }
    })
    
    const session = await stripe.checkout.sessions.create({
        line_items: products,
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            // {price: '{{PRICE_ID}}',
            // quantity: 1,}
        mode: 'payment',
        //success_url: `${process.env.CLIENT_URL}/cart?success=true`,
        success_url: `${process.env.CLIENT_URL}/order-complete`,
        //cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
        cancel_url: `${process.env.CLIENT_URL}/order-canceled`,
        automatic_tax: {enabled: true},
      });
    //   console.log('session:');
    //   console.dir(session);
      //create order here
      res.json({'sessionId': session.id, 'url': session.url});
}

exports.getStripeSession = async (req, res) => {
    const {id} = req.params;
    try{
        const session = await stripe.checkout.sessions.retrieve(id);
        if(session) res.status(200).json(session); 
        else throw new AppError('Payment not found!', 401);
    }catch(e){
        next(e);
    }
    
}

exports.addOrderHistory = async (req, res, next) => {
    const {id} = req.params;
    const {user_id, items }= req.body;//cartItems
    console.log(`sessionId: ${id}, user_id: ${user_id} items received in server: ${items}`);
    const session = await stripe.checkout.sessions.retrieve(id);

    const {created, amount_subtotal, amount_total, customer_details} = session;
    console.log('created Date: ', new Date(created * 1000));
    const orderCount = await Order.estimatedDocumentCount();

    try{
        const newOrder = new Order(
            {
                _id: id, //session id
                created: new Date(created * 1000), 
                purchaseNumber: orderCount + 1,
                subTotal: amount_subtotal,
                total: amount_total,
                items: items,
                paymentInfo: {
                    billingAddress: customer_details.address
                }
            });
        await newOrder.save();

        //const user = await User.findOne({email: customer_details.email});
        const user = await User.findById(user_id);
        if(!user) throw new AppError('User not Found!', 401);
        user.orders.push(newOrder);//add order ref to the user
        await user.save();
        //await User.findOneAndUpdate({id: customer_details.email}, {orders: user.orders.push(newOrder.id)})
        //console.log('new ordered to be added: ', newOrder);
        //console.log('user updated: ', user);
        res.status(200).send();
    }catch(e){
        console.log(e);
        next(e);
    }
}

exports.getOrderHistory = async (req, res, next) => {
    try{
        const {id} = req.params;
        const orders = await User.findOne({_id: id},{orders: 1}).populate('orders');
        //if(!orders) throw new AppError('Unable to find order history', 401);
        res.status(200).json(orders);
    }catch(e){
        console.log(e);
        next(e);
    }
}



