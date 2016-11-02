var express = require('express');
var router = express.Router();

/* GET users listing.
* 处理来访者访问逻辑
* */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//处理留言的逻辑
router.post('/contact', function (req, res) {
  res.send('感谢您的留言！');
});

module.exports = router;
