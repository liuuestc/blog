var express = require('express');
var router = express.Router();
var db4 = require('../models/article'),
    mongoose = require('mongoose'),
    Poster = mongoose.model('Poster'),
    HotPost = mongoose.model('HotPost');

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
    HotPost.find(
        function (err, data) {
            if(!err){
                var titles = new Array(4);
                var num = data.length;
                for (var i =0 ;i < num; i++){
                    var t = hotToTitle(data[i]);
                    switch (data[i]['subject']){
                        case 'Language' :
                            titles[0] = t;
                            break;
                        case 'Ideology' :
                            titles[1] = t;
                            break;
                        case 'China':
                            titles[2] = t;
                            break;
                        case 'Foreign':
                            titles[3] = t;
                            break;
                    }
                }
                res.render('blog',{hotTitle1: titles[0],hotTitle2: titles[1],hotTitle3: titles[2],hotTitle4 : titles[3]});


            }
        });
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

function hotToTitle(subject) {
    var title = "<a href='/articles/article/'" + subject['_id'] + "> "+ subject['title']+"</a>" +
        "<p style='margin-top: 5px;margin-bottom: 0px'><small>阅读量：" + subject['readNum'] +
        " 日期： " + subject['createdOn'] +
        "标签：" + subject['tags']+ "</small></p>";
    return title;
}


module.exports = router;
