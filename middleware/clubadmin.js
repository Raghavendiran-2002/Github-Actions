const AppError = require('../utils/AppError')

module.exports = async (req, res, next) => {
  try {
      if (!(req.user.role == 'superadmin' || req.user.role == 'clubadmin'))
        return next(new AppError('Only superadmin and clubadmin are allowed',403));
      
      next();
  } catch(err) {
    next(err)
  }
}
