const userCtrl = require("../controllers/user");
const router = require("express").Router();
const protect = require("../middleware/protect");
const adminProtect = require("../middleware/admin_protect");
const superAdmin = require("../middleware/superadmin");

router.route("/create").post(adminProtect, superAdmin, userCtrl.createUser);
router.route("/getAllUser").get(adminProtect, superAdmin, userCtrl.getAllUsers);

// important: login working without signing up
router.route("/login").post(userCtrl.login);
router.route("/signup").post(userCtrl.signup);
router.route("/teamsignup").post(protect, userCtrl.signupTeam);

router.route("/isExists/:email").get(userCtrl.verifyExists);
router.route("/getOne/:email").get(protect, userCtrl.getOneUsers);

router.delete('/deleteme',protect,userCtrl.deleteMe)

router
  .route("/update/:email")
  .patch(adminProtect, superAdmin, userCtrl.updateUser);
router
  .route("/delete/:email")
  .delete(adminProtect, superAdmin, userCtrl.deleteUser);

router.route("/aboutMe").get(protect, userCtrl.aboutMe);

router.get("/myaccomodation", protect, userCtrl.getMyAccomodation);
router.get("/myteam", protect, userCtrl.getMyTeam);

router.post('/updatepayment',adminProtect,superAdmin,userCtrl.changeUserPaymentStatus)

router.get("/id/:id", adminProtect, userCtrl.getOneUserWithId);

router.patch("/updateme", protect, userCtrl.updateMe);
module.exports = router;
