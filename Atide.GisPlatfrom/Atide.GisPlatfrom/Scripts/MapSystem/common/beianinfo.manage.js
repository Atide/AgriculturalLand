function ReadExcel(ouput) {
    var obj = JSON.parse(ouput);

    //require(["atide/gis/config/system-config"], function (SystemConfig) {
        
    //    $('#test').datagrid('loadData', { rows: obj[SystemConfig.excelConfig.sheetName] });
    //});
    $('#test').datagrid('loadData', { rows: obj });
}

function save() {
    var content = $('#test').datagrid('getData');
    var name = "beian/" + $("#yearselect").val() + $("#seasonselect").val() + ".json"
    $.post("/MapSystem/SaveJsonToFile", { path: name, content: JSON.stringify(content) }, function (data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
        if (status == "success") {
            layer.msg("保存成功！");
            //alert("保存成功！");
        }
    });
}

function del() {

    var row = $('#test').datagrid('getSelected');
    var index = $('#test').datagrid('getRowIndex', row);
    $('#test').datagrid('deleteRow', index);
    layer.msg("删除成功！");
}

function add() {
    var row = $('#test').datagrid('getSelected');
    if (row == null) {
        var rows = $('#test').datagrid('getRows');
        var index = rows.length;
        $('#test').datagrid('appendRow', {
            序号: index + 1
        });

    } else {
        var index = $('#test').datagrid('getRowIndex', row);
        $('#test').datagrid('insertRow', {
            index: index + 1,	// index start with 0
            row: {
                序号: index + 2
            }
        });
    }
}

function selectOnchang(obj) {
    var name = "beian/" + $("#yearselect").val() + $("#seasonselect").val() + ".json"
    $.post("/MapSystem/GetJsonFromFile", { name: name }, function (data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
        if (status == "success" && (data.indexOf("fail:") < 0)) {
            var obj = JSON.parse(data);
            $('#test').datagrid('loadData', { rows: obj.rows });
        }
        else {
            $('#test').datagrid('loadData', { rows: {} });
        }
    });


}

