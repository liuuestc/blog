var express = require('express');
var router = express.Router();
var formidable = require('formidable');
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
    //console.log(req.body);
    Poster.create({
        subject: req.body.subject,
        tags : req.body.tags,
        title: req.body.title,
        content : req.body.thecontent,
        author: 'liuuestc'
    }, function (err, post) {
        if (!err){
            console.log('文章创建成功！');
            var date = processDateString(post.createdOn);
            console.log(date);
            res.render('posted',{subject:post.subject, tags:post.tags, title: post.title,content: post.content,author : post.author, createOn: date, readNum: post.readNum});
        }
        if (!post){
            console.log("文章创建失败！");
            res.redirect('/articles/create');
        }
    });
});


//处理图片有kindeditor上传
router.post('/uploadImg', function (req, res) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/../public/uploadImg';
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        var image = files.imgFile;
        var path = image.path;
        path = path.replace('/\\/g', '/');
        var url = '/uploadImg' + path.substr(path.lastIndexOf('/'), path.length);
        var info = {
            "error": 0,
            "url": url
        };
        res.send(info)
    });
});

//获取某一类型的文章
router.get('/class/:category/:id',function (req, res) {
   var category = req.params['category'],
       id = req.params['id'];
    Poster.find(
        {subject: category},
        'title tags readNum createOn _id',
        {sort: '-_id',skip:parseInt(req.params['id'])*10, limit: 10},
        function (err, poster) {
            if(!err){
                res.json({'status' : 'ok', 'postes' :poster})
            }
            if (!poster){
                res.json({'status' : 'error'});
            }
        });
});


//文章编辑后展示页面

router.get('/show/:date', function (req, res) {
    console.log(req.params['date']);

});

function processDateString(date) {
    var dt = new Date(date.toString());
    return dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() +
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
}

module.exports = router;
