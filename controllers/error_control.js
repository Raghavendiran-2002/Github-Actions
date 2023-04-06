const AppError = require('../utils/AppError');

module.exports = (err,req,res,next) => {

	// Missing Fields Error
	// console.log(err.errors[0].message)
	if(err.errno === 1048) {
    	err.statusCode = 422
    	err.message = err.message;
	}
    
    if(err.errno === 1292) {
    	err.statusCode = 422
    	err.message = err.message;
    }
    

    if (err.name === 'SequelizeValidationError') {
          err.statusCode = 400
          // if(err.)
          err.message = err.errors[0].message
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
          err.statusCode = 409
          console.log(err )
          err.message = `${err.errors[0].message}` 
    }

if(err.name === 'JsonWebTokenError' || err.message === "jwt expired")
  err.statusCode = 401

  if(err.statusCode == 4090)
  {
    err.data = err.message;
    err.message = "User already registered";
    err.statusCode = 409
  }

    // if(err.statusCode = 1062){
    // 	err.statusCode = 409
    // 	err.message = err.errors[0].message;
    // }
          // console.log(err.name  )


   if(!err.statusCode)
   {
        err.statusCode = 500
        err.message = err.message
   }

  	res.status(err.statusCode).json({
  		  status : 'error',
        message : err.message,
        data : err.data || null
  	});
 }