const teamCtrl = require("../controllers/team");
const adminProtect = require("../middleware/admin_protect");
const router = require("express").Router();
const protect = require("../middleware/protect");

router.route("/create").post(adminProtect, teamCtrl.createTeam);
router.route("/getAll").get(teamCtrl.getAllTeams);

router.route("/getOne/:id").get(teamCtrl.getOneTeams);
router.route("/update/:id").patch(adminProtect, teamCtrl.updateTeam);
router.route("/delete/:id").delete(adminProtect, teamCtrl.deleteTeam);

module.exports = router;
