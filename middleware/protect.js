const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const Admin = require("../models/admin_model.js");
const User = require("../models/user.js");

module.exports = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    let decoded;

    let user;

    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      user = await User.findByPk(decoded.id);
    } catch (err) {
      try {
        decoded = await promisify(jwt.verify)(
          token,
          process.env.ADMIN_JWT_SECRET
        );

        user = await Admin.findByPk(decoded.username);
      } catch (err1) {
        return next(err1);
        // console.log(err1)
      }

      // console.log(err)
    }

    if (!user) return next(new AppError("User Not Found", 404));

    // console.log(user)

    req.user = user;

    next();
  } catch (err) {
    // console.log(err)
    next(err);
  }
};
