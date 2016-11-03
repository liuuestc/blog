/**
 * Created by liuuestc on 16-11-4.
 * 用于处理ajax交互程序
 */

$(document).ready(function () {
    $('#submitMessage').click(function () {
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
