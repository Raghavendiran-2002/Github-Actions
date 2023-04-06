const AppError = require('../utils/AppError')

module.exports = async (req, res, next) => {
  try {
      if (!(req.user.role == 'superadmin'))
        return next(new AppError('Only superadmin are allowed',403));
      
      next();
  } catch(err) {
    next(err)
  }
}
