var express = require('express');
var router = express.Router();

/*
 *
 *GET home page.
 * 主要用来展示主页的逻辑
 * （最终结果）每次打开传送不同的文章段落
 *
 * */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/about', function (req, res) {
    res.render('about');
});

router.get('/blog',function (req, res) {
   res.render('blog');
});

router.get('/error',function (req, res) {
    res.render('error');
});

//需要修改渲染的页面
router.get('/profile',function (req, res) {
    if(req.session.isLogin == true)
        res.render('portfolio');
    res.render('index');
});

router.get('/services',function (req, res) {
    if(req.session.isLogin == true)
        res.render('services');
    res.render('index');
});

router.get('/contact', function (req, res) {
   res.render('contact');
});
module.exports = router;
