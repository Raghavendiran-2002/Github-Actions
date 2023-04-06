const jwt = require('jsonwebtoken')
const { promisify } = require('util');
const AppError = require('../utils/AppError')
const Admin = require('../models/admin_model.js');

module.exports = async (req, res, next) => {
  try {
    let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } 
      if (!token) {
        return next(
          new AppError('You are not logged in! Please log in to get access.', 401)
        );
      }

      const decoded = await promisify(jwt.verify)(token, process.env.ADMIN_JWT_SECRET);

      const user = await Admin.findByPk(decoded.username);

      if(!user)
        return next(new AppError('Admin Not Found',404));

      req.user = user;

      next();
  } catch(err) {
    // console.log(err)
    next(err)
  }
}
