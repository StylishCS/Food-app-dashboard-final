var express = require('express');
var router = express.Router();
const { protect } = require("../middleware/protect");


// router.use(protect);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
