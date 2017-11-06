/**
 * 文章 表
 */

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    title: String, //文章标题
    body: String, //文章内容
    cover: String, //文章封面
    comments: [{
        body: String, //评论内容
        data: {
            type: Date,
            default: Date.now
        }
    }],
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('article', userSchema);