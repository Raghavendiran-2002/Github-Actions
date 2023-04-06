const adminCtrl = require('../controllers/admin_control');
const router = require('express').Router();
const adminProtect = require('../middleware/admin_protect')
const adminEvent = require('../controllers/admin_event_controller');
const superAdmin = require("../middleware/superadmin");

router.route('/')
	.post(adminProtect,adminCtrl.addAdmin)
router.route('/login')
	.post(adminCtrl.adminLogin)

router.get('/events',adminEvent.getAllEvents);
router.get('/events/pending',adminEvent.getAllPendingEvents);
router.get('/events/approved',adminEvent.getAllApprovedEvents);
router.get('/events/rejected',adminEvent.getAllRejectedEvents);
router.get('/events/commingsoon',adminEvent.getAllCommingSoonEvents);
router.get('/events/closed',adminEvent.getAllClosedEvents);

router.get('/events/answer',adminProtect,adminEvent.getUserAnsForEvent)

router.patch('/events/status/:id',adminProtect,superAdmin,adminEvent.eventStatusChange)


module.exports = router