/**
 * Created by skk on 2017/11/10
 * 服务树函数类
 */
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/domReady!"],
    function (declare, lang) {
        return declare(null, {
            districtTree: null,
            constructor: function () {
                this.initTree();
            },

            initTree: function () {
                var that = this;
                $.get("/MapSystem/GetJsonFromFile", { name: "service.json" }, function (data, status) {

                    that.districtTree = that.creatTree($.parseJSON(data), "serviceTree");
                    //console.log("Data: " + data + "\nStatus: " + status);
                });

            },
            creatTree: function (Nodes, divID) {
                if ($.fn.zTree.getZTreeObj(divID)) {
                    $.fn.zTree.destroy(divID);
                }
                var that = this;
                var treeDom = $("#" + divID);
                var setting = {
                    view: {
                    //    addHoverDom: that.addHoverDom,
                    //    removeHoverDom: that.removeHoverDom,
                        //    selectedMulti: false
                        addDiyDom: that.addDiyDom
                    },
                    //check: {
                    //    enable: true,
                    //    autoCheckTrigger: true,
                    //    chkStyle: "radio",
                    //    radioType: "level"
                    //},
                    //edit: {
                    //    enable: true,
                    //    showRemoveBtn: true,
                    //    showRenameBtn: true
                    //},
                    callback: {
                        onClick: that.zTreeOnClick
                        //    onCheck: that.onCheck,
                        //    onRemove: that.onRemove,
                        //    onRename: that.onRename
                    }
                };
                var tree = $.fn.zTree.init(treeDom, setting, Nodes);
                return tree;
            },

            zTreeOnClick: function (event, treeId, treeNode) {
                //alert(treeNode.tId + " name:" + treeNode.name + "url:" + treeNode.serviceurl);
                var serviceLayer = g_main._mapControl._map.getLayer("serviceLayer");
                if (serviceLayer) {
                    g_main._mapControl._map.removeLayer(serviceLayer);
                }
                if (treeNode.serviceurl == null || treeNode.serviceurl == "" )
                {
                    return;
                }              
                require(["esri/layers/ArcGISDynamicMapServiceLayer", "dojo/domReady!"],
                    function (ArcGISDynamicMapServiceLayer) {
                        serviceLayer = new ArcGISDynamicMapServiceLayer(treeNode.serviceurl, {
                            "id": "serviceLayer",
                            "opacity":treeNode.layeropacity
                        });
                        
                        var visible = treeNode.visuallayers.split(",")

                        if (visible.length === 0) {

                            visible.push(-1);

                        }
        
                        for (var i = 0 ; i < visible.length; i++) {
                            console.log(visible[i]);
                        }

                        serviceLayer.setVisibleLayers(visible);
                        g_main._mapControl._map.addLayer(serviceLayer);
                    });
            },

            addDiyDom: function (treeId, treeNode) {
                if (treeNode.id != 1) {
                    return;
                }
                var IDMark_A = "_a";
                var aObj = $("#" + treeNode.tId + IDMark_A);
               
                var editStr = "<span class='demoIcon' id='diyBtn_" + treeNode.id + "_add" + "' title='添加服务' onfocus='this.blur();'><span class='button icon01'></span></span>";
                editStr += "<span class='demoIcon' id='diyBtn_" + treeNode.id + "_delete" + "' title='删除服务' onfocus='this.blur();'><span class='button icon02'></span></span>";
                editStr += "<span class='demoIcon' id='diyBtn_" + treeNode.id + "_edit" + "' title='编辑服务' onfocus='this.blur();'><span class='button icon03'></span></span>";
                editStr += "<span class='demoIcon' id='diyBtn_" + treeNode.id + "_save" + "' title='保存服务' onfocus='this.blur();'><span class='button icon04'></span></span>";

                aObj.after(editStr);
                    //aObj.append(editStr);
                    var btn = $("#diyBtn_" + treeNode.id + "_add");
                    if (btn) btn.bind("click", function () {

                        layer.open({
                            type: 2,
                            title: '服务管理',
                            maxmin: true,
                            area: ['400px', '400px'],
                            content: '/MapSystem/ServiceManageView?type=1'
                        });
                        //var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
                        //var node = treeObj.getNodeByParam("id", 1, null);
                        //var newNode = {
                        //    pId: 1,
                        //    name: "行政区划-1",
                        //    serviceurl: "http://220.165.247.91:6080/arcgis/rest/services/XZQH/MapServer",
                        //    visuallayers: "0"
                        //};
                        //newNode = treeObj.addNodes(node, newNode);
                    });

                    btn = $("#diyBtn_" + treeNode.id + "_delete");
                    if (btn) btn.bind("click", function () {
                        var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
                        var nodes = treeObj.getSelectedNodes();
                        if (nodes == null || nodes.length ==0) {
                            layer.msg('请选择要删除的服务节点!');
                            return;
                        }
                            
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            if (nodes[i].id == 1) {
                                layer.msg('根节点无法删除，请其他服务节点!');
                                continue;
                            }
                            treeObj.removeNode(nodes[i]);
                        }
                    });

                    btn = $("#diyBtn_" + treeNode.id + "_edit");
                    if (btn) btn.bind("click", function () {

                        var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
                        var nodes = treeObj.getSelectedNodes();
                        if (nodes == null || nodes.length == 0) {
                            layer.msg('请选择要编辑的服务节点!');
                            return;
                        }

                        for (var i = 0, l = nodes.length; i < l; i++) {
                            if (nodes[i].id == 1) {
                                layer.msg('根节点无法编辑，请其他服务节点!');
                                return;
                            }
                        }
                        layer.open({
                            type: 2,
                            title: '服务管理',
                            maxmin: true,
                            area: ['400px', '400px'],
                            content: '/MapSystem/ServiceManageView?type=2'
                        });
                    });
                
                    btn = $("#diyBtn_" + treeNode.id + "_save");
                    if (btn) btn.bind("click", function () {
                        var treeObj = $.fn.zTree.getZTreeObj("serviceTree");
                        var treeJson = treeObj.getNodes();

                        $.post("/MapSystem/SaveServiceToJson", { path: "", content: JSON.stringify(treeJson) }, function (data, status) {
                            console.log("Data: " + data + "\nStatus: " + status);
                            if (status == "success") {
                                alert("保存成功！");
                            }
                        });
                    });
            },
            onCheck: function (e, treeId, treeNode) {
                alert("name:" + treeNode.name + "url:" + treeNode.serviceurl + "check:" + treeNode.check);

            },
            onRename: function (e, treeId, treeNode, isCancel) {
                alert("name:" + treeNode.name + "url:" + treeNode.serviceurl + "check:" + treeNode.check);
            },
            onRemove: function (e, treeId, treeNode) {
                alert("name:" + treeNode.name + "url:" + treeNode.serviceurl + "check:" + treeNode.check);
            },
            addHoverDom: function (treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='add node' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if (btn) btn.bind("click", function () {
                    var zTree = $.fn.zTree.getZTreeObj("serviceTree");
                    zTree.addNodes(treeNode, { id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++) });
                    return false;
                });
            },
            removeHoverDom: function (treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove();
            },

        })
    });
