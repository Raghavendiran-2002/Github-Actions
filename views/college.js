const collegeCtrl = require("../controllers/college");
const router = require("express").Router();
const protect = require("../middleware/protect");
const adminProtect = require("../middleware/admin_protect");

router.route("/create").post(protect,collegeCtrl.createCollege);
router.route("/getAll").get(collegeCtrl.getAllColleges);

router.route("/getOne/:id").get(collegeCtrl.getOneColleges);
router.route("/update/:id").patch(adminProtect, collegeCtrl.updateCollege);
router.route("/delete/:id").delete(adminProtect, collegeCtrl.deleteCollege);

module.exports = router;
