const ticket_Ctrl = require("../controllers/ticket_controller");
const adminProtect = require("../middleware/admin_protect");
const superAdmin = require("../middleware/superadmin");
const router = require("express").Router();
const protect = require("../middleware/protect");

router.route("/create").post(protect, ticket_Ctrl.createTicket);
router.route("/getAll").get(adminProtect, ticket_Ctrl.getAllTickets);

router.route("/getOne/:id").get(protect, ticket_Ctrl.getOneTicket);

router.route("/blockticket/:id").post(protect, ticket_Ctrl.bookTicketedEvent);

router
  .route("/webhook/bookticket")
  .post(protect, ticket_Ctrl.bookTicketWebhook);
router
  .route("/getrefund")
  .get(adminProtect, superAdmin, ticket_Ctrl.getAllRefunds);

router.route("/event/:id").get(adminProtect, ticket_Ctrl.getAllTicketOfEvent);
router.route("/update/:id").patch(adminProtect, ticket_Ctrl.updateTicket);
router.route("/delete/:id").delete(adminProtect, ticket_Ctrl.deleteTicket);

router.get("/user/:id", adminProtect, superAdmin, ticket_Ctrl.userTicket);
router.get("/myticket", protect, ticket_Ctrl.myTickets);
router.get("/myteam/:ticketId", protect, ticket_Ctrl.getTeamOfTicket);
router.get("/myteamticket", protect, ticket_Ctrl.myTeamTickets);

module.exports = router;
