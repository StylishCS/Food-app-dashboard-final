var express = require("express");
var router = express.Router();
const { adminLogin } = require("../controllers/userController");
const { validate } = require("../validation/login_validation");
const { protect } = require("../middleware/protect");
const reviews = require("../controllers/reviewsController");

router.use(protect);
router.route("/").get(reviews.getReviews);
router.post("/:userId/:productId", reviews.addReview)

router.route("/:id").get(reviews.getReview).delete(reviews.deleteReview)

module.exports = router