const User = require("../models/user");
const Accomodation = require("../models/accomodation_model");
const College = require("../models/college");
const AppError = require("../utils/AppError");
const crypto = require("crypto");
const TeamRegister = require("../models/team_event_model");
const jwt = require("jsonwebtoken");
const { sendProfileEmail } = require("../services/sendEmail");
const { Op } = require("sequelize");

exports.createUser = async (req, res, next) => {
  try {
    // if (!req.body.collegeId) throw new AppError("provide collegeId", 400);

    // const checkCollege = await College.findByPk(req.body.collegeId);

    // if (!checkCollege) throw new AppError("college not found", 404);

    const user = await User.create(req.body);

    // const college = await College.findByPk(req.params.collegeId);

    // user.collegeId(college)
    // await user.save()

    res.status(200).json({
      status: "success",
      message: "user created",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
    // console.log(err)
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ include: College });
    // console.log( await users.getColleges());
    res.status(200).json({
      status: "success",
      message: "",
      data: {
        no_of_users: users.length,
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOneUsers = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.params.email },
      include: [College],
    });

    if (!user) throw new AppError("User Not Found", 404);

    // user.collegeId = await user.getCollege()

    res.status(200).json({
      status: "success",
      message: "",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOneUserWithId = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) throw new AppError("User Not Found", 404);

    // user.collegeId = await user.getCollege()

    res.status(200).json({
      status: "success",
      message: "user",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updateduser = await User.update(req.body, {
      where: { email: req.params.email },
    });

    // if(!updateduser[0])
    // 	throw new AppError('user not found',404));

    res.status(200).json({
      status: "success",
      message: "user Updated",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const updateduser = await User.update(req.body, {
      where: { id: req.user.id },
    });

    try {
      await sendProfileEmail(req.body.email, req.body.name);
    } catch (err) {
      console.log(err);
    }

    // if (req.body.isAccomodation) {
    //   const checkAccomodation = await Accomodation.findOne({
    //     where : {userId: req.user.id}
    //   })
    //   console.log(checkAccomodation)
    //   if(checkAccomodation)
    //     return next(new AppError('Accomodation created already',409))

    //   if(!req.body.start_date || !req.body.end_date)
    //     return next(new AppError('provide start_date and end_date',400))

    //   const acc = await Accomodation.create({
    //     start_date: req.body.start_date,
    //     end_date: req.body.end_date,
    //     userId: req.user.id,
    //   });
    //   // console.log(acc)
    // }
    // if(!updateduser[0])
    // 	throw new AppError('user not found',404));

    res.status(200).json({
      status: "success",
      message: "user Updated",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyAccomodation = async (req, res, next) => {
  try {
    const acc = await Accomodation.findOne({ where: { userId: req.user.id } });

    res.status(200).json({
      status: "success",
      message: "user Accomodation",
      data: {
        accomodation: acc,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.aboutMe = async (req, res, next) => {
  try {
    // if(!updateduser[0])
    // 	throw new AppError('user not found',404));

    const college = await College.findByPk(req.user.collegeId);

    res.status(200).json({
      status: "success",
      message: "user Details",
      data: { ...req.user.dataValues, college: college },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });

    if (!user) throw new AppError("User Not Found", 404);

    await TeamRegister.destroy({
      where: {
        user_email: user.email,
      },
    });

    await user.destroy();

    res.status(200).json({
      status: "success",
      message: "user Deleted",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) throw new AppError("User Not Found", 404);

    await user.destroy();

    res.status(200).json({
      status: "success",
      message: "user Deleted",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!email) throw new AppError("Please Provide email", 400);

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) throw new AppError("User Not Found", 404);

    // console.log(user.id)

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      status: "success",
      message: "login success",
      data: {
        token: token,
        email: user.email,
        id: user.id,
        is_registered: user.is_registered,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyExists = async (req, res, next) => {
  try {
    if (!req.params.email) throw new AppError("Provide Email ID", 400);
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) throw new AppError("User Not Found", 404);
    return res.status(200).json({
      success: true,
      message: "User Found",
      data: {
        isExist: true,
      },
    });
  } catch (err) {
    next(err);
    // console.log(err)
  }
};

exports.signup = async (req, res, next) => {
  try {
    // if (!req.body.collegeId) throw new AppError("provide collegeId", 400);
    if (!req.body.email) throw new AppError("Provide email", 400);

    // const checkCollege = await College.findByPk(req.body.collegeId);

    // if (!checkCollege) throw new AppError("college not found", 404);

    if (req.body.is_paid) delete req.body.is_paid;

    // if (req.body.isAccomodation && (!req.body.start_date || !req.body.end_date))
    //   throw new AppError("provide start_date and end_date", 400);
    // console.log(req.body.email)
    const college = req.body.email.split("@")[1].split(".")[0];

    let person_type;

    if (college == "sastra") person_type = 0;
    else person_type = 2;

    // const checkUser = await User.findOne({where : {email : req.body.email}});
    // if(checkUser)
    // 	throw new AppError('email already exist',409))

    // const participantId = await ParticipantId.create({});

    const user = await User.create({
      email: req.body.email,
      person_type,
      user_type: false,
      collegeId: req.body.collegeId,
    });

    // console.log(await Accomodation.findOne({userId : user.id}))

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      status: "success",
      message: "signup success",
      data: {
        token: token,
        email: user.email,
        id: user.id,
      },
    });
  } catch (err) {
    next(err);
    // console.log(err)
  }
};

// exports.getUserWithParticipantId = async (req,res,next) => {
//   try {
//     const id = req.params.id;

//     const user = await
//   } catch(err) {
//     next(err)
//   }
// }

exports.signupTeam = async (req, res, next) => {
  try {
    if (!req.body.collegeId) throw new AppError("Provide collegeId", 400);
    // if (!req.body.email) throw new AppError("provide email", 400);

    // if(req.body.userType == )
    // console.log(req.user.teamId)
    // if (req.user.teamId) return next(new AppError("team already create", 400));

    if (req.body.isAccomodation && (!req.body.start_date || !req.body.end_date))
      throw new AppError("Please Provide start_date and end_date for Accomodation", 400);

    const checkCollege = await College.findByPk(req.body.collegeId);

    if (!checkCollege) throw new AppError("College Not Found", 404);

    if (req.body.is_paid) delete req.body.is_paid;

    if (req.body.teamMembers.length < 1)
      throw new AppError("This is a Team Event Please Provide teamMembers", 400);

    const college = req.user.email.split("@")[1].split(".")[0];

    let personType;

    if (college == "sastra") personType = 0;
    else personType = 2;

    const teamId = crypto.randomBytes(20).toString("hex");

    // const college = el.email.split('@')[1].split('.')[0];

    req.user.personType = personType;
    (req.user.teamId = teamId), (req.user.userType = 1);
    req.user.phoneNumber = req.body.phoneNumber || null;
    req.user.dateOfBirth = req.body.dateOfBirth || null;
    if (req.body.isAccomodation) req.user.isAccomodation = true;

    let team = req.body.teamMembers.map((el) => {
      el.personType = personType;
      el.collegeId = checkCollege.id;
      el.teamId = teamId;
      el.userType = 1;
      if (req.body.isAccomodation) el.isAccomodation = true;

      return el;
    });

    // team.push(req.body);

    // const checkUser = await User.findOne({where : {email : req.body.email}});

    // if(checkUser)
    // 	throw new AppError('email already exist',409))
    const users = await User.bulkCreate(team);
    await req.user.save();

    if (req.body.isAccomodation) {
      const checkAccomodation = await Accomodation.findOne({
        where: {
          userId: req.user.id,
        },
      });

      if (checkAccomodation)
        throw new AppError("Accomodation Already Exists", 409);

      const acc = users.map((el) => {
        return {
          userId: el.id,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          teamId: teamId,
        };
      });

      acc.push({
        userId: req.user.id,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        teamId: teamId,
      });

      const totalAcc = acc.length;

      const accomodation = await Accomodation.bulkCreate(acc);
      // console.log(totalAcc,accomodation)
    }

    // const id = users.find((el) => {
    //   return el.email == req.body.email;
    // });

    // const token = jwt.sign(
    //   {
    //     id: req.user.id,
    //     email: req.body.email,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "15d",
    //   }
    // );

    res.status(200).json({
      status: "success",
      message: "signup success",
      data: {
        // token: token,
        user: req.user,
        team: users,
        // id,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyTeam = async (req, res, next) => {
  try {
    if (!req.user.teamId) throw new AppError("No Team Found", 404);

    const teamMem = await User.findAll({
      where: { teamId: req.user.teamId },
    });

    res.status(200).json({
      status: "success",
      message: "team members",
      data: {
        no_of_members: teamMem.length,
        teams: teamMem,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.changeUserPaymentStatus = async (req,res,next) => {
  try {
    const ids = req.body.ids;
    // console.log(ids)
    const user = await User.update({
      is_paid : true
    },{
      where : {
        id : {[Op.in] : ids}
      }
    })

    // console.log(user)
    res.status(200).json({
      status : "success",
      message : "all user status updated",
      data : null
    })
  } catch(err) {
    next(err)
  }
}

// exports.bulkPaymentUpdate = async (req,res,next) => {
//   try {
//     const id = req
//   } catch(err) {
//     next(err)
//   }
// }

// const User = require("../models/user");
// const College = require("../models/college");
// const AppError = require("../utils/AppError");

// const jwt = require("jsonwebtoken");

// exports.createUser = async (req, res, next) => {
//   try {
//     if (!req.body.collegeId) throw new AppError("provide collegeId", 400);

//     const checkCollege = await College.findByPk(req.body.collegeId);

//     if (!checkCollege) throw new AppError("college not found", 404);

//     const user = await User.create(req.body);

//     // const college = await College.findByPk(req.params.collegeId);

//     // user.collegeId(college)
//     // await user.save()

//     res.status(200).json({
//       status: "success",
//       message: "user created",
//       data: {
//         user,
//       },
//     });
//   } catch (err) {
//     next(err);
//     // console.log(err)
//   }
// };

// exports.getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.findAll({ include: College });
//     // console.log( await users.getColleges());

//     res.status(200).json({
//       status: "success",
//       message: "",
//       data: {
//         no_of_users: users.length,
//         users,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getOneUsers = async (req, res, next) => {
//   try {
//     const user = await User.findOne(
//       { email: req.params.email },
//       { include: College }
//     );

//     if (!user) throw new AppError("user not found", 404);

//     // user.collegeId = await user.getCollege()

//     res.status(200).json({
//       status: "success",
//       message: "",
//       data: {
//         user,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.updateUser = async (req, res, next) => {
//   try {
//     const updateduser = await User.update(req.body, {
//       where: { email: req.params.email },
//     });

//     // if(!updateduser[0])
//     // 	throw new AppError('user not found',404));

//     res.status(200).json({
//       status: "success",
//       message: "user Updated",
//       data: null,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deleteUser = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.params.email });

//     if (!user) throw new AppError("user not found", 404);

//     await user.destroy();

//     res.status(200).json({
//       status: "success",
//       message: "user Deleted",
//       data: null,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const email = req.body.email;

//     if (!email) throw new AppError("provide email", 400);

//     const user = await User.findOne({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) throw new AppError("user not found", 404);

//     // console.log(user.id)

//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "15d",
//       }
//     );

//     res.status(200).json({
//       status: "success",
//       message: "login success",
//       data: {
//         token: token,
//         email: user.email,
//         id: user.id,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.verifyExists = async (req, res, next) => {
//   try {
//     if (!req.params.id) throw new AppError("Provide Email ID", 400);
//     const user = await User.findOne({ email: req.params.email });
//     if (!user) throw new AppError("User not found", 404);
//     return res.status(200).json({
//       success: true,
//       message: "User Found",
//       data: {
//         isExist: true,
//       },
//     });
//   } catch (err) {
//     next(err);
//     // console.log(err)
//   }
// };

// exports.signup = async (req, res, next) => {
//   try {
//     if (!req.body.collegeId) throw new AppError("provide collegeId", 400);
//     if (!req.body.email) throw new AppError("provide email", 400);

//     const checkCollege = await College.findByPk(req.body.collegeId);

//     if (!checkCollege) throw new AppError("college not found", 404);

//     if (req.body.role) delete req.body.role;

//     const college = req.body.email.split("@")[1].split(".")[0];

//     let personType;

//     if (college == "sastra") personType = 0;
//     else personType = 2;

//     // const checkUser = await User.findOne({where : {email : req.body.email}});

//     // if(checkUser)
//     // 	throw new AppError('email already exist',409))

//     const user = await User.create({ ...req.body, personType });

//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "15d",
//       }
//     );

//     res.status(200).json({
//       status: "success",
//       message: "signup success",
//       data: {
//         token: token,
//         email: user.email,
//         id: user.id,
//       },
//     });
//   } catch (err) {
//     next(err);
//     // console.log(err)
//   }
// };
