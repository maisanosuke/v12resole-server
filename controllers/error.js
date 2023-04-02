//define error handling middleware

//must have 4 arguments to be recoginzed as error handling mw
const AppError = require("../utils/ExpressError");

const handleValidationError = (err) => {
    console.log('err.erros:', err.errors);
    console.log('err.message:', err.message);
    //let errors = {};
    let errors = [];
    Object.keys(err.errors).forEach((key) => {
      //errors[key] = err.errors[key].message;
      errors.push(err.errors[key].message);
    });
    //return res.status(400).send(errors);
    return new AppError(errors.join(', '), 400);
}

const handleDuplicateKeyError = (err) => {
    console.log('err: ', err);
    return new AppError(`An account with ${err.keyValue._id} exists`, 409);
}

const errorHandler = (err, req, res, next) => {
    console.log('you hit error handling middleware');
    console.log('error name: ', err.name);
    // try{
        if(err.name == 'ValidationError'){ 
            console.log('you hit validationerror');
            err = handleValidationError(err);
        };
        if(err.code && err.code == 11000){ 
            console.log('you hit duplicate key error');
            err = handleDuplicateKeyError(err)
        };
    // }catch(e){
        const {status = 500, message ='something went wrong'} = err;
        console.log(`Status: ${status} message: ${message}`);
        res.status(status).send(message);

    // }
}

module.exports = errorHandler;