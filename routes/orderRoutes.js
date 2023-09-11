var express = require("express");
var router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/protect");


router.use(protect);
router
.route("/")
.post(orderController.createOrder)

router
.route("/profit")
.get(orderController.getProfit)

module.exports = router;