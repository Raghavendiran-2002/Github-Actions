const questionCtrl = require('../controllers/question_controller');
const router = require('express').Router();
const protect = require('../middleware/protect')
const adminProtect = require("../middleware/admin_protect");
const superAdmin = require("../middleware/superadmin");

router.route('/create')
	.post(adminProtect,questionCtrl.createQuestion)
router.route('/getAll')
	.get(adminProtect,questionCtrl.getAllQuestions)

router.route('/getOne/:id')
	.get(adminProtect,questionCtrl.getOneQuestion)
router.route('/update/:id')
	.patch(adminProtect,questionCtrl.updateQuestion)
router.route('/delete/:id')
	.delete(adminProtect,questionCtrl.deleteQuestion)

module.exports = router