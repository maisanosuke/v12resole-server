require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/users');
const errorHandler = require('./controllers/error');
const { createCheckout, addOrderHistory, getStripeSession, getOrderHistory } = require('./controllers/orders');
const { postEmailSignup, postUserMessage } = require('./controllers/controllers');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_URL)
.then(()=>{
    console.log('mongo connection open!');
    app.listen(3001, () => console.log('running on PORT 3001'));
})
.catch(e => console.log('error connecting to Mongo ', e));

app.use(cors({
    origin: ["http://localhost:3000/", "https://v12resole.onrender.com"]
}));
app.use(express.json());

app.use('/user', userRoutes);

app.get('/order/:id', getStripeSession);
app.get('/order-history/:id', getOrderHistory);
app.post('/order/:id', addOrderHistory);
app.post('/checkout', createCheckout);

//nodemailer
app.post('/message', postUserMessage);
//mailchimp
app.post('/', postEmailSignup)


app.get('/', (req, res) => {
    res.send('this is server');
});

app.use(errorHandler);

