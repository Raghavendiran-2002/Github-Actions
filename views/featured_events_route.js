const featuredeventCtrl = require("../controllers/featured_events_controller");
const adminProtect = require("../middleware/admin_protect");
const router = require("express").Router();
const protect = require("../middleware/protect");
const superAdmin = require("../middleware/superadmin");

router
  .route("/create")
  .post(adminProtect, superAdmin, featuredeventCtrl.createFeaturedEvent);
router.route("/getAll").get(featuredeventCtrl.getAllFeaturedEvents);

router.route("/getOne/:id").get(featuredeventCtrl.getOneFeaturedEvent);
router
  .route("/update/:id")
  .patch(adminProtect, superAdmin, featuredeventCtrl.updateFeaturedEvent);
router
  .route("/delete/:id")
  .delete(adminProtect, superAdmin, featuredeventCtrl.deleteFeaturedEvent);

module.exports = router;
