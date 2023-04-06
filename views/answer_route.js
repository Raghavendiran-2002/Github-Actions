const answerCtrl = require("../controllers/answer_controller");
const router = require("express").Router();
const protect = require("../middleware/protect");
const adminProtect = require("../middleware/admin_protect");
const superAdmin = require("../middleware/superadmin");

router.route("/create").post(adminProtect, answerCtrl.createAnswer);
router.route("/getAll").get(adminProtect, answerCtrl.getAllAnswers);

router.route("/getOne/:id").get(adminProtect, answerCtrl.getOneAnswer);
router.route("/update/:id").patch(adminProtect, answerCtrl.updateAnswer);
router.route("/delete/:id").delete(adminProtect, answerCtrl.deleteAnswer);

module.exports = router;
