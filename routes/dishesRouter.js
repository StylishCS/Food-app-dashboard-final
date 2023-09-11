var express = require("express");
var router = express.Router();
const { adminLogin } = require("../controllers/userController");
const { validate } = require("../validation/login_validation");
const { protect } = require("../middleware/protect");
const {
  addDish,
  getAllDishes,
  getDish,
  updateDish,
  deleteDish,
} = require("../controllers/dishesController");
const upload = require("../middleware/uploadFiles");
// router.use("/", validate());

router.use(protect);
router.route("/").get(getAllDishes).post(upload.single("image"), addDish);

router
  .route("/:id")
  .get(getDish)
  .patch(upload.single("image"), updateDish)
  .delete(deleteDish);
module.exports = router;
