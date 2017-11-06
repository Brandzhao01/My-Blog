//require('bootstrap')
//require('BOOTSTRAP_CSS')
require('!style-loader!css-loader!./login.css');
let MD5 = require('md5.js');
console.log("woshi js")
$('.login form').on('submit', function(e) {
    e.preventDefault();
    console.log('11');
    let [username, password] = [this.username.value.trim(), this.password.value.trim()];
    //console.log(username, password)
    if (!username || !password) {
        $('#errMesg').text('用户名或密码不能为空！')
            .show()
            .animate({
                display: 'none'
            }, 1500, function() {
                $(this).hide()
            });
        return;

    }
    password: new MD5().update(password).digest('hex');
    $.ajax({
        url: '/api/user/check',
        method: 'post',
        data: {
            username: username,
            password: password
        },
        success: function(data) {
            if (data.success) {
                location.href = '/admin/index';
            } else {
                $('#errMesg').text('用户名或密码不正确！')
                    .show()
                    .animate({
                        display: 'none'
                    }, 1500, function() {
                        $(this).hide()
                    });
            }
            console.log('后端返回给前端的数据', data)
        }

    })


})