const express = require('express');
const router = express.Router();

let Article = require('../dbModels/article');

//后端相应给前端的数据格式
let responseMesg;
router.use((req, resp, next) => {
    responseMesg = {
        success: false,
        message: '',
        data: {
            total: 0,
            rows: []
        }
    };
    next();
});

router.get('/index', (req, res, next) => {
    res.render('admin/article-list', {
        user: req.session.user
    });
});



/**
 * 文章添加
 */
router.get('/article/add', (req, res, next) => {

    res.render('admin/article-add');
});


/**
 * 文章详情
 */

router.get('/article/details', (req, res, next) => {

    res.render('article-datails');
});


/*
 *查询列表(一次性查出所有数据)
 */
router.get('/article/list', (req, res, next) => {
    Article.find().then(articles => {
        res.json(articles)
    })
});

/**
 * 查询列表服务端分页
 */

router.get('/article/Pagination', (req, res, next) => {
    let offset = Number(req.query.offset); //从那开始开始
    let limit = Number(req.query.limit); //最多能放几个
    let order = (req.query.order === 'asc' ? 1 : -1); //排序方式 asc代表升序
    let sort = req.query.sort || '_id'; //按那个字段排序

    // offset/limit + 1 = page
    Article.count().then(count => {
        responseMesg.data.total = count;
    })
    Article.find().sort({
        [sort]: order

        //skip 代表要跳过前面skip条数据，limit 往后面去limit条数据
    }).skip(offset).limit(limit).then(articles => {

        responseMesg.success = true;
        responseMesg.data.rows = articles;
        res.json(responseMesg);
    })
});


/**
 * 文章编辑
 */
router.get('/article/:id', (req, res, next) => {
    let id = req.params.id;
    Article.findById(id).then(article => {
        res.render('admin/article-edit', {
            article
        })

    })

})


/**
 * 删除文章
 */
router.delete('/article/:id', (req, res, next) => {
    Article.findByIdAndRemove(req.params.id).then(article => {
        responseMesg.message = '删除成功';
        responseMesg.success = true;
        res.json(responseMesg)
    })

})

/**
 * 修改文章
 */

router.post('/article/update', (req, res, next) => {
    let parms = req.body;
    Article.findByIdAndUpdate(parms.id, {
        title: parms.title,
        body: parms.body

    }).then(article => {
            if (article) {
                responseMesg.success = true;
                responseMesg.message = '修改成功'
            } else {
                responseMesg.message = '修改失败'
            }
            res.json(responseMesg);
        }

    )
});


/*
 *保存文章
 */

let i = 0
router.post('/article/save', (req, res, next) => {
    let parms = req.body;
    if (!parms.title || !parms.body) {
        responseMesg.message = '标题或者内容不能为空';
        res.json(responseMesg);

        return
    }
    new Article({
        title: parms.title,
        body: parms.body
    }).save().then(article => {
        responseMesg.success = true;
        responseMesg.message = '保存成功';
        res.json(responseMesg)

    })
});
module.exports = router;