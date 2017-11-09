
var g_UserState = 1;//1 新增 2 编辑 
var g_UserValideMsg = "";//错误信息提示

//初始化用户表格
$(function () {
    $('#userTable').datagrid({
        url: '/MapSystem/GetJsonFromFile',
        method: 'get',
        table: true,
        singleSelect: true,
        nowrap:false,
        toolbar:  [{
            text: '新增',
            iconCls: 'icon-add',
            handler: function () {
                $('#userInfo').css("display", "block");
                document.getElementById("authority").selectedIndex = 2;
                document.getElementById("state").selectedIndex = 0;
                $('#username').val("");
                $('#logionname').val("");
                $('#password').val("");
                $('#company').val("");
                $('#telephone').val("");
                $('#email').val("");

                $('#userOperTitle').html("用户新增");
                $('#logionname').attr('disabled', false);
                g_UserState = 1;
            }
        }, {
            text: '删除',
            iconCls: 'icon-cut',
            handler: function () {
                var rows = $("#userTable").datagrid('getSelections');//这里是用getSelections获取到选中的行的数据。
                var Ele = []//新建一个空的数组
                for (i = 0; i < rows.length; i++) {//循环，把行的数组拆分。
                    Ele.push(rows[i]);//把拆分好的数据用push的方法保存到数组Ele中。
                }
                for (j = 0; j < Ele.length; j++) {
                    var index = $("#userTable").datagrid('getRowIndex', Ele[j])//循环Ele里面的数据，根据几条数据（几行）获取到对应数量的索引。
                    if (Ele[j].logionname == "administrator") {
                        alert("超级管理员账户不可以删除!");
                        return;
                    }
                    $("#userTable").datagrid('deleteRow', index)//根据索引删除对应的行。
                }
            }
        }, {
            text: '编辑',
            iconCls: 'icon-edit',
            handler: function () {
                var row = $("#userTable").datagrid('getSelected');

                if (row) {
                    $('#username').val(row.username);
                    $('#logionname').val(row.logionname);
                    $('#password').val(row.password);
                    $('#company').val(row.company);
                    $('#telephone').val(row.telephone);
                    $('#email').val(row.email);
                    $('#authority').val(row.authority);
                    $('#state').val(row.state);

                }
                $('#logionname').attr('disabled', true);
                $('#userInfo').css("display", "block");
                $('#userOperTitle').html("用户编辑");
                
                g_UserState = 2;

            }
        }, '-', {
            text: '保存',
            iconCls: 'icon-save',
            handler: function () {
                var arr = JSON.stringify($('#userTable').datagrid('getData'));

                $.post("/MapSystem/SaveJsonToFile", { path: "", content: arr }, function (data, status) {
                    console.log("Data: " + data + "\nStatus: " + status);
                    if (status == "success") {
                        alert("保存成功！");
                    }
                });
            }
        }],
        columns: [[
            { field: 'logionname', title: '用户账号', width: 100 },
            { field: 'password', title: '用户密码', width: 100, hidden: true },
            { field: 'username', title: '用户名称', width: 100 },
             { field: 'company', title: '单位名称', width: 100 },
              { field: 'telephone', title: '联系电话', width: 100 },
               { field: 'email', title: '电子邮箱', width: 100 },
                {
                    field: 'authority', title: '用户权限', width: 100, formatter: function (value, row, index) {
                        if (value == 1) {
                            return "管理员用户";
                        } else if (value == 2) {
                            return "一般用户";
                        }
                        else if (value == 3) {
                            return "普通用户";
                        }
                        else {
                            return value;
                        }
                    }
                },
                {
                    field: 'state', title: '使用状态', width: 100, formatter: function (value, row, index) {
                        if (value == 1) {
                            return "启用";
                        } else if (value == 2) {
                            return "停止";
                        }
                        else {
                            return value;
                        }
                    }
                }
        ]]
    });
    //$('#userTable').datagrid('getPanel').removeClass('lines-both lines-no lines-right lines-bottom').addClass("lines-no");
})


//确定修改
function onButtonOk() {
    if (!userValide()) {
        alert(g_UserValideMsg);
        return;
    }
    if (g_UserState == 1) {
        $('#userTable').datagrid('insertRow', {
            index: 0,
            row: {
                username: $('#username').val(),
                logionname: $('#logionname').val(),
                password: $('#password').val(),
                company: $('#company').val(),
                telephone: $('#telephone').val(),
                email: $('#email').val(),
                authority: $('#authority').val(),
                state: $('#state').val(),
            }
        });
    }
    else if (g_UserState == 2) {
        var row = $("#userTable").datagrid('getSelected');
        var index = $("#userTable").datagrid('getRowIndex', row)
        var grid = $("#userTable").datagrid("updateRow", {
            index: index,
            row: {
                username: $('#username').val(),
                logionname: $('#logionname').val(),
                password: $('#password').val(),
                company: $('#company').val(),
                telephone: $('#telephone').val(),
                email: $('#email').val(),
                authority: $('#authority').val(),
                state: $('#state').val(),
            }
        });

    }

    $('#userInfo').css("display", "none");


}

//取消修改
function onButtonCancle() {
    $('#userInfo').css("display", "none");
}

//用户信息验证
function userValide() {
    if ($('#username').val() == "") {
        g_UserValideMsg = "用户名不能为空！";
        return false;
    }
    if ($('#logionname').val() == "") {
        g_UserValideMsg = "用户账户不能为空！";
        return false;
    }
    if ($('#password').val() == "") {
        g_UserValideMsg = "用户密码不能为空！";
        return false;
    }
    if (g_UserState == 1) {
        var rows = $('#userTable').datagrid("getRows");
        for (var i = 0; i < rows.length; i++) {
            if (rows[i]['logionname'] == $('#logionname').val()) {
                g_UserValideMsg = "该账号已存在，请重新输入！";
                return false;
            }

        }
    }
    
    return true;
}