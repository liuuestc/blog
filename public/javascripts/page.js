/**
 * Created by liuuestc on 16-11-4.
 * 用于处理ajax交互程序
 */

$(document).ready(function () {





    //处理访客主题事件
    $('#language').click(function () {
        alert("你点击了language");
        var getUrl = '/articles/category/language/0'
        var flag = true ;//简单的判断是否还有下一页
        $.post(getUrl,function (response, status) {
            if (status = 'success'){
                if(response['status'] == 'ok'){
                    var postes = response['postes'];
                    var length = postes.length;
                    if(length < 10) flag = false;
                    var titles = '';
                    for (var i=0; i < length; i++){
                        titles +=returnTitle(postes[i]);
                    }
                    $('#blog').html(titles);
                    //判断是否有下一页，下面的函数添加上一页或下一页
                }
                else {
                    alert('文章获取失败!');
                }
            }
            else {
                alert('与服务器连接失败！');
            }
        });


    });
    //给作者留言
    $('#submit2').click(function () {
        if ($('#email').val() == ''){
            alert('邮箱不能为空');
            return;
        }
        if($('#message').val().length < 15){
            alert('留言不能少于十五个字符');
            return;
        }

        var postUrl = '/processor/contact';
        $.post(postUrl,
            {
                firstname:$('#firstname').val(),
                lastname : $('#lastname').val(),
                email : $('#email').val(),
                subject : $('#subject').val(),
                message : $('#message').val()
            },
            function (response, status) {
            if (status == 'success'){
                if (response['status'] == 'ok'){
                    confirm('留言提交成功,非常感谢你的留言！');
                    location.href = '/';
                }
                else {
                    alert('留言提交失败，请重新提交！');
                    return;
                }
            }else {
                alert('与服务器连接失败 ，请再次提交');
            }
        });
    });
});

//最重要的函数确定怎么添加文章列表
function returnTitle(titles) {
    var rtnTitle = '';
    return rtnTitle;
}

//根据标题返回文章的url，addTitle函数使用
function returnUrl(title,id) {
    var url;
    url = "<a href=" + "/article/" + id +">" + title +"</a>" ;
    return url;
}
//转换时间到字符串, addTitle函数使用
function processDateString(date) {
    var dt = new Date(date.toString());
    return dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() +
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
}