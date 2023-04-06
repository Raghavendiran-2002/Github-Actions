const transaction_Ctrl = require("../controllers/transaction_controller");
const adminProtect = require("../middleware/admin_protect");
const router = require("express").Router();
const protect = require("../middleware/protect");

router.route("/create").post(protect, transaction_Ctrl.createTransaction);
router.route("/getAll").get(adminProtect, transaction_Ctrl.getAllTransactions);

router
  .route("/getOne/:id")
  .get(adminProtect, transaction_Ctrl.getOneTransaction);
router
  .route("/update/:id")
  .patch(adminProtect, transaction_Ctrl.updateTransaction);
router
  .route("/delete/:id")
  .delete(adminProtect, transaction_Ctrl.deleteTransaction);

module.exports = router;
