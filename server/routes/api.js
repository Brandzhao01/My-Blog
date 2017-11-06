const express = require('express');
const router = express.Router();

//引入数据库
let User = require('../dbModels/user')

//后端相应给前端的数据格式
let responseMesg;


//在进入下面的路由之前，先调用中间件处理
//该中间件在api.js里，所以只拦截api.js里面的路由
router.use((req, resp, next) => {
    console.log('中间件进来了')
    responseMesg = {
        success: false,
        message: ''
    };
    next();
});

//校验用户名密码
router.post('/user/check', (request, response, next) => {
    let parms = request.body;
    //首先判断前端传的参数是否正确(后端必须做参数的正确性校验，考虑最坏的情况)
    if (!parms.username || !parms.password) {
        //返回给前端一个错误消息
        responseMesg.message = '用户名或密码不能为空！'
        response.json(responseMesg);
        return;
    }

    //Promise写法   实现链式写法
    User.findOne({
            username: parms.username,
            password: parms.password
        })
        .then((user) => {
            console.log('查询结果');
            if (user) {
                responseMesg.success = true;
                responseMesg.message = '登陆成功';
                //登陆成功后往session里面存东西
                //把数据库查出来的这个user 作为标识存到session的user属性上
                request.session.user = user;
                response.json(responseMesg);
            } else {
                responseMesg.message = '用户名或者密码不正确！'
                response.json(responseMesg);

            }
        })
})

/**
 * 注册
 */

router.get('/user/registe', (request, response, next) => {
    new User({
        username: 'customer',
        password: '123456'
    }).save().then(User => {
        responseMesg.success = true;
        responseMesg.message = '保存成功';
        response.json(User)

    }).catch(error => {
        console.log('报错了', error)
    })
})

module.exports = router;