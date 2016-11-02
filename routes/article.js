var express = require('express');
var router = express.Router();
var db1 = require('../models/article'),
    mongoose = require('mongoose'),
    Poster = mongoose.model('Poster');

/* GET users listing.
* 处理文章编辑逻辑
* 最重要的js文件
* */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create',function (req, res) {
   if(req.session.isLogin == true)
       res.render('post',{title: '编辑博文！'});
    //需要修改为首页
    res.render('post',{title: '编辑博文！'});
});

//将文章存储到数据库中。
router.post('/create', function (req, res) {
    console.log(req.body);
    Poster.create({
        subject: req.body.subject,
        tags : req.body.tags,
        title: req.body.title,
        content : req.body.thecontent,
        author: 'liuuestc'
    }, function (err, post) {
        if (!err){
            console.log('文章创建成功！');
            res.render('posted',{subject:post.subject, tags:post.tags, title: post.title,content: post.content,author : post.author})
        }
        if (!post){
            console.log("文章创建失败！");
            res.redirect('/articles/create');
        }
    });
});

//文章编辑后展示页面

router.get('/show/:date', function (req, res) {
    console.log(req.params['date']);

});

module.exports = router;
