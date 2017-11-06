//初始化编辑器
var ue = UE.getEditor('body');

require("jquery-validation")

require('jquery-validation/dist/localization/messages_zh')

$.validator.setDefaults({
    ignore: "",
    highlight: function(element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function(element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "span",
    errorPlacement: function(error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent().parent().parent());
        } else {
            error.appendTo(element.parent());
        }
    },
    errorClass: "help-block",
    validClass: "help-block"


});
$('form').validate({
    rules: {
        'title': {
            'required': true,
            'maxlength': 15
        },
        'body': {
            'required': true,

        },
        'password': {
            'required': true,
            'minlength': 6
        }
    },
    messages: {
        'title': {
            'required': '标题不能为空',

        },

    },
    submitHandler: function(form) {

        $.ajax({
            url: '/admin/article/update',
            method: 'post',
            data: {
                id: $('#id').val(),
                title: $("#title").val(),
                body: ue.getContent()
            },
            success: function(resp) {
                if (resp.success) {
                    alert(resp.message);
                    location.href = '/admin/index';
                }

            }
        })



    }

})