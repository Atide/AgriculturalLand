
var g_UserState = 1;//1 新增 2 编辑 
function onButtonOk() {
    if (g_UserState == 1) {
        $('#userTable').datagrid('insertRow', {
            index: 0,
            row: {
                username: $('#username').val()
            }
        });      
    }
    else if (g_UserState == 2) {
        var row = $("#userTable").datagrid('getSelected');
        var index = $("#userTable").datagrid('getRowIndex', row)
        var grid = $("#userTable").datagrid("updateRow", {
            index: index,
            row: {
                username: $('#username').val()
            }
        });
    }
    
    $('#userInfo').css("display", "none");

   
}