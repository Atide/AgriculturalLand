//以指定的Json数据，初始化JStree控件
//treeName为树div名称，url为数据源地址，checkbox为是否显示复选框，loadedfunction为加载完毕的回调函数
function bindJsTree(treeName, url, checkbox, loadedfunction) {
    var control = $('#' + treeName)
    control.data('jstree', false);//清空数据，必须

    var isCheck = arguments[2] || false; //设置checkbox默认值为false
    if (isCheck) {
        //复选框树的初始化
        $.getJSON(url, function (data) {
            control.jstree({
                'plugins': [ "checkbox"], //出现选择框
                'checkbox': { cascade: "", three_state: false }, //three_state为true,选中子节点，自动选中父节点
                'check_node': true,
                'core': {
                    'data': data,
                    "themes": {
                        "responsive": false
                    }
                }
            }).bind('loaded.jstree', loadedfunction);
        });
    }
    else {
        //普通树列表的初始化
        $.getJSON(url, function (data) {
            control.jstree({
                'core': {
                    'data': data,
                    "themes": {
                        "responsive": false
                    }
                },
                "types": {
                    "default": {
                        "icon": "fa fa-folder icon-state-info icon-lg"
                    },
                    "file": {
                        "icon": "fa fa-file icon-state-info icon-lg"
                    }
                }
            }).bind('loaded.jstree', loadedfunction);
        });
    }
}