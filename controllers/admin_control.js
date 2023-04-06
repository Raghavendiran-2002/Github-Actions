const Admin = require("../models/admin_model");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");

exports.addAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.create(req.body);

    res.status(200).json({
      status: "success",
      message: "admin created",
      data: {
        email: admin.email,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
      return next(new AppError("Please Provide Username And Password", 400));

    const admin = await Admin.findByPk(username);

    if (!admin) return next(new AppError("Admin Email Not Found", 404));

    console.log(admin);
    if (!(await admin.checkPassword(password, admin.password)))
      return next(new AppError("Wrong Password", 401));
    console.log(admin.username);
    const token = jwt.sign(
      {
        username: admin.username,
      },
      process.env.ADMIN_JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      status: "success",
      message: "admin created",
      data: {
        username: admin.username,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
