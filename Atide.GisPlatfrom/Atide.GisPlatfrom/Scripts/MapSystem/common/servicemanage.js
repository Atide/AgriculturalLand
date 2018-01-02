
var g_ServiceState = "0";//1 新增 2 编辑 
var g_UserValideMsg = "";//错误信息提示

//注意：parent 是 JS 自带的全局对象，可用于操作父页面
var index = parent.layer.getFrameIndex(window.name); //获取窗口索引

//初始化用户表格
$(function () {
    //服务编辑
    if ($('#serviceOperTitle').text() == "服务新增") {


           $('#servicename').val("");
           $('#serviceurl').val("");
         $('#visuallayer').val("");
         $('#layeropacity').val(0.5);

    }
    else {
        var treeObj = parent.$.fn.zTree.getZTreeObj("serviceTree");

        var nodes = treeObj.getSelectedNodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
            $('#servicename').val(nodes[i].name);
            $('#serviceurl').val(nodes[i].serviceurl);
            $('#visuallayer').val(nodes[i].visuallayers);
            $('#layeropacity').val(nodes[i].layeropacity);

        }      
    }
});


//确定修改
function onButtonOk() {
    //parent.$('#parentIframe').text('我被改变了');
    //parent.layer.tips('Look here', '#parentIframe', { time: 5000 });
    
    if ($('#serviceOperTitle').text() == "服务新增") {

        var treeObj = parent.$.fn.zTree.getZTreeObj("serviceTree");
        var node = treeObj.getNodeByParam("id", 1, null);
        var newNode = {
            pId: 1,
            name: $('#servicename').val(),
            serviceurl: $('#serviceurl').val(),
            visuallayers: $('#visuallayer').val(),
            layeropacity:$('#layeropacity').val()
        };
        treeObj.addNodes(node, newNode);
    }
    else {
        var treeObj = parent.$.fn.zTree.getZTreeObj("serviceTree");
        var nodes = treeObj.getSelectedNodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
            nodes[i].name = $('#servicename').val();
            nodes[i].serviceurl = $('#serviceurl').val();
            nodes[i].visuallayers = $('#visuallayer').val();
            nodes[i].layeropacity = $('#layeropacity').val();
            treeObj.updateNode(nodes[0]);
        }
    }

    parent.layer.close(index);

}

//取消修改
function onButtonCancle() {
    parent.layer.close(index);
}

//用户信息验证
function serviceValide() {
  
    
    return true;
}