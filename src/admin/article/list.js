console.log('我是文章列表');
require('bootstrap-table');
require('bootstrap-table/dist/locale/bootstrap-table-zh-CN');
require('BOOTSTRAP_TABLE_CSS');
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

$('#table').bootstrapTable({
    //url: '/admin/article/list',
    url: '/admin/article/Pagination',
    sortOrder: 'desc',
    columns: [{
        field: '_id',
        title: 'ID',
        width: 100,
        visible: false,
        sortable: true,

    }, {
        field: 'title',
        title: '标题',
        sortable: true
    }, {
        field: 'time',
        title: '发布时间',
        align: 'center',
        sortable: true,
        formatter: function(value) {
            if (!value) return '';
            return new Date(value).format('yyyy-MM-dd hh:mm:ss');
        }
    }, {
        field: 'oprate',
        title: '操作',
        align: 'center',
        formatter: function(value) {
            return `<div class="btn-group">
                    <button data-action="edit" type="button" class="btn btn-primary">编辑</button>
                    <button disabled data-action="delete" type="button" class="btn btn-danger">删除</button>
                </div>`
        },
        events: {
            'click [data-action="edit"]': function(e, value, row, index) {
                console.log(e, value, row, index)
                location.href = '/admin/article/' + row['_id'];
            },
            'click [data-action="delete"]': function(e, value, row, index) {
                let isSrue = window.confirm('您确认要删除文章 [' + row['title'] + '] 吗？')
                if (isSrue) {
                    //alert('确定删除')
                    $.ajax({
                        url: '/admin/article/' + row['_id'],
                        method: 'delete',
                        success: function(resp) {
                            alert(resp.message);
                            if (resp.success) {
                                $('#table').bootstrapTable('remove', {
                                    field: '_id',
                                    values: [row['_id']]
                                })
                            }
                        }

                    })
                }
            }
        }

    }],
    pagination: true,
    classes: 'table table-hover table-no-bordered',
    showRefresh: true,
    showColumns: true,
    paginationPreText: '上一页',
    paginationNextText: '下一页',
    sidePagination: 'server',
    responseHandler: function(resp) { //加载后端数据成功后会调用的函数
        if (!resp.success) {
            return {
                total: 0,
                rows: []
            }
        }
        return resp.data;
    }
});