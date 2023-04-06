const eventCtrl = require("../controllers/event_controller");
const adminProtect = require("../middleware/admin_protect");
const router = require("express").Router();
const protect = require("../middleware/protect");

router.route("/create").post(adminProtect, eventCtrl.createEvent);
router.route("/getAll/:category").get(eventCtrl.getEventByCategory);
router.route("/getAll").get(eventCtrl.getAllEvents);
// router.route("/:category").get(eventCtrl.getEventByCategory);

router.route("/register").post(protect, eventCtrl.registerEvent);
router.post("/teamregister", protect, eventCtrl.teamEventRegister);

router.route("/getOne/:id").get(eventCtrl.getOneEvent);
router.route("/update/:id").patch(protect, eventCtrl.updateEvent);
router.route("/category").get(eventCtrl.getEventCategory);
router.route("/delete/:id").delete(protect, eventCtrl.deleteEvent);

module.exports = router;
