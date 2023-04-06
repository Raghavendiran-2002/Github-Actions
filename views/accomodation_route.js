const accomodationCtrl = require("../controllers/accomodation_controller");
const router = require("express").Router();
const protect = require("../middleware/protect");
const adminProtect = require("../middleware/admin_protect");

router.route("/create").post(protect, accomodationCtrl.createAccomodation);
router.route("/getAll").get(adminProtect, accomodationCtrl.getAllAccomodations);

router
  .route("/getOne/:id")
  .get(adminProtect, accomodationCtrl.getOneAccomodation);
router
  .route("/update/:id")
  .patch(adminProtect, accomodationCtrl.updateAccomodation);
router
  .route("/delete/:id")
  .delete(adminProtect, accomodationCtrl.deleteAccomodation);

module.exports = router;
