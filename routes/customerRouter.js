var express = require("express");
var router = express.Router();
const customer = require("../controllers/customerController")
const { protect } = require("../middleware/protect");

router.use(protect);
router.get('/new', customer.newCustomer)
router.get('/old', customer.oldCustomer)
router.get('/come', customer.comeBackCustomer)
router.get('/allCustomers', customer.getAllCustomers)

module.exports = router