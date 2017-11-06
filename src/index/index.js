require('!style-loader!css-loader!./index.css');
console.log('我是index.js 3');




var content = document.getElementById('content');
var articleImg = content.getElementsByClassName('articleTitle');
var articleTitle = content.querySelectorAll('a');

for (var i = 0; i < articleTitle.length; i++) {
    articleTitle[i].index = i;
    articleTitle[i].onmouseover = function() {
        articleImg[this.index].style.display = 'block';

    }
    articleTitle[i].onmouseout = function() {
        articleImg[this.index].style.display = 'none';

    }

}