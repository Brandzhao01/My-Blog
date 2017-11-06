module.exports = (req, res, next) => {
    console.log('所有的请求都被我拦截掉', req.url);

    if (app.locals.isDev) {
        app.use(require('./auth'))
    }
    if (req.url.startsWith('/admin')) {
        if (req.session.user) {
            console.log('有权限，允许放行'),
                next();
        } else {
            console.log('没有登录，不允许访问，想跳转到登录'),
                res.redirect('/login');
        }
    } else {
        next();
    }
}