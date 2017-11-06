const express = require('express');
const router = express.Router();

let Article = require('../dbModels/article')

/**
 *  判断是ajax请求还是页面直接刷新的请求  中间件
 * 如果是ajax请求则返回片段
 * 如果是直接刷新的请求则返回完整页面
 * 这个中间件只负责判断不负责渲染
 */

router.use((req, res, next) => {

    //req.xhr   拿到是否ajax请求
    res.locals.isAjax = req.xhr;

    next()

})

/**
 * 首页
 */
router.get('/', (req, res, next) => {
    let page = Number(req.query.page) || 1;
    let limit = 9;
    let offset = (page - 1) * limit;
    Article.find().sort({
        _id: -1
    }).skip(offset).limit(limit).then(articles => {
        articles.map((item, index) => {
            //获取body中的第一张图片地址作为封面
            let result = item.body.match(/<img[^>]*src=['"]([^'"]+)[^>]*>/);
            if (result) {
                item.cover = result[1]
            } else {
                item.cover = 'http: //timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510063993&di=297d60f134462f0a2c198c35c6c9673d&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F16%2F92%2F80%2F41y58PICupz_1024.jpg';
            }
            //过滤html
            item.body = item.body.replace(/<[^>]+>/g, '').substring(0, 77) + '...';

            return item;
        })

        res.render('index', {
            articles
        })
    })
});

router.get('/index', (req, res, next) => {
    res.render('index');
});

/**
 * 联系方式
 */
router.get('/contact', (req, res, next) => {
    res.render('contact');
});

/**
 * 个人摘要
 */
router.get('/personal', (req, res, next) => {
    res.render('personal');
});

/**
 * 使用须知
 */
router.get('/know', (req, res, next) => {
    res.render('know');
});

/**
 * 跳转详情页
 */

router.get('/index/datails/:id', (req, res, next) => {

    let id = req.params.id;
    console.log('进入详情页')
    console.log(id)
    Article.findById(id).then(article => {
        res.render('article-datails', {
            article
        });
    }).catch(error => {
        res.render('404');
    })
});


/**
 * 跳转到登录界面
 */
router.get('/login', (req, res, next) => {
    res.render('login');
});

/**
 * 退出
 */
router.get('/logout', (req, res, next) => {
    req.session.user = null;
    res.render('index');
});


/**
 * 首页文章列表
 */

router.get('/article/list', (req, res, next) => {

    let page = Number(req.query.page) || 1;
    let limit = 9;
    let offset = (page - 1) * limit;
    Article.count().then(count => {
        responseMesg.data.total = count;
    })
    Article.find().sort({
        _id: -1
    }).skip(offset).limit(limit).then(articles => {
        articles.map((item, index) => {
            //获取body中的第一张图片地址作为封面
            let result = item.body.match(/<img[^>]*src=['"]([^'"]+)[^>]*>/);
            if (result) {
                item.cover = result[1]
            } else {
                item.cover = 'http: //timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510063993&di=297d60f134462f0a2c198c35c6c9673d&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F16%2F92%2F80%2F41y58PICupz_1024.jpg';
            }
            //过滤html
            item.body = item.body.replace(/<[^>]+>/g, '').substring(0, 77) + '...';

            return
        })
        res.json(articles);
    })
});
module.exports = router;