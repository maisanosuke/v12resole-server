const User = require('../models/User.js');
//const bcrypt = require('bcrypt');
const AppError = require('../utils/ExpressError.js');

exports.signupUser = async (req, res, next) => {
    //console.log('req.body: ', req.body);
    const {id, email, firstName, lastName} = req.body;
    //const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.@$!%*#?&])[A-Za-z\d.@$!%*#?&]{8,}$/;
    try{
        //if(!passwordRule.test(password)) throw new AppError('Password needs at least 8 characters, contain number and special character', 400);
        //const hashed = await bcrypt.hash(password, 12); //12 is how long salt is, takes about 200ms to hash
        const newUser = new User({_id: id, email, firstName, lastName});
        await newUser.save();
        res.status(201).json({message: 'Successfully Signed Up on MongoDB!'});
    }
    catch(e){
        console.log(e);//console.log('e.message:', e.message);
        next(e);//pass to error handler
    }
}


exports.loginUser = async (req, res, next) => {
    const {email} = req.body;
    try{
        const foundUser = await User.findOne({email: email});
        if(foundUser){
            console.log('user found in MongoDB: ', foundUser);
            console.log('foundUser.id:', foundUser._id);
            res.status(200)
            .json({
                    message: 'Successfully Logged In',
                    user: {
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName
                    }
                });
            return;
        }
        else{
            throw new AppError('User not found!', 403)
        }
    }
    catch(e){
        console.log(e);
        next(e);//pass to error handler
    }
}


exports.resetPassword = async (req, res) => {
    const {email, password} = req.body;
    console.log(`password reset with ${email}, ${password}`);
}

exports.updateUser = async (req, res) => {
    const {email, newEmail} = req.body;
    console.log(`update user with ${email} to ${newEmail}`);
    try{
        const updatedUser = await User.findOneAndUpdate({email}, {email: newEmail}, {new: true});
        console.log('updatedUser:', updatedUser);
        res.status(204).json({message: 'Successfully updated user on MongoDB'});
    }
    catch(e){
        console.error(e);
        next(e);
    }
}