var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db1 = require('../models/article'),
    mongoose = require('mongoose'),
    Poster = mongoose.model('Poster'),
    HotPost = mongoose.model('HotPost');

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

//获取某一类型的文章,这个函数用于后面的使用。
router.get('/class/:category/:id',function (req, res) {
   var category = req.params['category'],
       id = req.params['id'];
    Poster.find(
        {subject: category},
        'title tags readNum createdOn _id',
        {sort: '-_id',skip:parseInt(req.params['id'])*8,limit: 8},
        function (err, poster) {
            if(!err){
                var titles = '';
                var length = poster.length;
                for (var i = 1; i < length ; i ++){
                    titles += hotToTitle(poster[i],i);
                }
                res.render('titles',{titles: titles});
            }
            if (!poster){
                res.render('<p>没有更多的文章了</p>');
            }
        });
});

router.get('/createHot', function (req, res) {
    //下面的代码以后移动到上面,必须登陆后才可以查看。
    findHot('Language');      //这里由于是异步的所以不能同时返回
    findHot('Ideology');
    findHot('China');
    findHot('Foreign');
    res.send('创建成功！');
});

//将获取博客类别的主页换成下面的函数。
router.get('/hot', function (req, res) {
    HotPost.find(
        function (err, data) {
            if(!err){
                var titles = new Array(4);
                var num = data.length;
                for (var i =0 ;i < num; i++){
                    switch (data[i]['subject']){
                        case 'Language' :
                            titles[0] = hotToTitle(data[i],0);
                            break;
                        case 'Ideology' :
                            titles[1] = hotToTitle(data[i],1);
                            break;
                        case 'China':
                            titles[2] = hotToTitle(data[i],2);
                            break;
                        case 'Foreign':
                            titles[3] = hotToTitle(data[i],3);
                            break;
                    }
                }
                res.render('blog',{hotTitle1: titles[0],hotTitle2: titles[1],hotTitle3: titles[2],hotTitle4 : titles[3]});
            }
        });
});

//获取文章函数：
router.get('/article/:id', function (req, res) {
    var id = req.params['id'];
    Poster.findById(id
    ,function (err, post) {
        var subject = post;
       if (!err){
           if (!post){
               console.log('文章找不到了');
               res.send('<p>文章找不到了！</p>')
           }else {
               var title = "<h2 style='text-align: center'>"+ subject['title'] +"</h2>"+
                   "<p style='margin-top: 5px;margin-bottom: 0px; text-align: center'><small>阅读量：" + subject['readNum'] +
                   " 日期： " + subject['createdOn']+
                   "标签：" + subject['tags']+ "</small></p>";
               res.render('article',{title: title, post:post['content']});
           }

       }
       else {
           res.send("<p>查找文章失败！</p>")
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

//数据库插入最新文章函数,
function findHot(subject) {
    Poster.find(
        {subject: subject},
        {},
        {sort: '-_id'},
        function (err, data) {
            if(!err){
                if(data != ''){
                    HotPost.create({
                        id: data[0]['_id'],
                        subject: data[0]['subject'],  //文章的类别
                        tags: data[0]['tags'],     //文章系类
                        title:  data[0]['title'],   //文章的标题
                        author:data[0]['author'],    //作者
                        readNum: data[0]['readNum'], //文章的阅读量
                        createdOn: processDateString(data[0]['createdOn'] )//创建时间
                    },function (err, hotPost) {
                       if (!err){
                           console.log('查找完毕！')
                       }
                       if (!hotPost)
                           return null
                    });

                }
            }
            else{
              console.log('获取数据失败！');
                return null;
            }
        }
    )
}
//将最新文章抽取的数据转换成html
function hotToTitle(subject,i) {
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a onclick='return false;' href='/articles/article/"+subject['_id']+"'> "+ subject['title']+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>阅读量：" + subject['readNum'] +
        " 日期： " + subject['createdOn'] +
        "标签：" + subject['tags']+ "</small></p></div> ";
    return title;
}

//

module.exports = router;
