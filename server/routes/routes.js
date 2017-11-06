module.exports = app => {

    //app.use(require('./auth'));
    //console.log('是否是开发模式：', app.locals.isDev);


    //引入路由
    app.use('/api', require('./api'));
    app.use('/admin', require('./admin'));
    app.use('/', require('./main'));
}