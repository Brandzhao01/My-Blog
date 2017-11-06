const express = require('express');
const swig = require('swig');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'alibaba',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

/**
 * 富文本框
 */
const ueditor = require("ueditor");
const path = require('path');
app.use('/ueditor', express.static(__dirname + '/public/ueditor'));
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    //客户端上传文件设置
    var imgDir = '/ueditor/upload/img'
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir; //默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/ueditor/upload/file'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/ueditor/upload/video'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));


/**
 * swig模板
 */
app.engine('html', swig.renderFile);
app.set('views', './server/views');
app.set('view engine', 'html');

console.log('取出的变量值', process.env.NODE_ENV);
const isDev = process.env.NODE_ENV === 'dev';

app.locals.isDev = isDev;
if (isDev) {
    //模板 不缓存
    swig.setDefaults({
        cache: false
    });

    //实现webpack而刷新 中间件
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js');
    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        stats: {
            colors: true
        },
        publicPath: webpackConfig.output.publicPath

    }))

    app.use(require('webpack-hot-middleware')(compiler));


    //引入路由
    require('./server/routes/routes')(app);


    //实现同步功能
    const browserSync = require('browser-sync');

    const reload = require('reload');
    const http = require('http');
    const server = http.createServer(app);
    reload(app)
    server.listen(8080, () => {

        browserSync.init({
            ui: false,
            open: false,
            online: false,
            proxy: 'localhost:8080',
            files: './server/views/**',
            port: 3000
        })
        console.log('web启动成功')
    })

} else {



    app.use('/public', express.static(__dirname + '/public'));

    //引入路由
    require('./server/routes/routes')(app);



    app.listen(80, () => {
        console.log('web应用启动成功')
    })
}

mongoose.connect('mongodb://localhost:27017/Blog', { useMongoClient: true })
    .on('open', (db) => {
        console.log('数据库连接成功')
    })
    .on('error', (error) => {
        console.log('数据库连接不成功')
    });