/**
 * Created by 刘佳佳 on 2017/04/24
 * 整个地图控件及框架初始化类：完成布局初始化、地图控件初始化
 */
define(["dojo/_base/declare", "dojo/on", "dojo/dom", "dojo/_base/lang", "atide/gis/config/system-config", "atide/gis/mapcontrol"],
    function (declare, on, dom, lang, systemConfig, ArcGISMapControl) {
        return declare('atide.gis.main',null, {
            _mapControl: null,      //地图控件
            _menuType: null,
            //构造函数
            constructor: function (param) {                            
                this._mapControl = new ArcGISMapControl({
                    id: "map"
                });
                this.initControl();   
            },
            initControl: function () {
                $("#tree").height($("#map").height() - 60);
                $("#result").height($("#map").height() - 60);
                this.initToolbar();
              //  this.initTree();
            },
            initToolbar: function () {
                $('.btn-toolbar').on('click',
                    function (event) {
                        switch ($(this).attr("id")) {
                            case 'tool-xzqtree':
                                //$('#floatPane').css('display', 'block'); 
                                //$('#result').parent().css('display', 'block'); 
                                //$('#tree').parent().css('display', 'none'); 
                                dojo.byId('floatPane').style.display = 'block';
                                dojo.byId('resultdiv').style.display = 'block';
                                dojo.byId('treediv').style.display = 'none';
                                //require(['atide/myModule'], function (myModule) { myModule.setText('result', 'hello11111'); });
                                break;
                            case 'tool-result':
                                //$('#floatPane').css('display', 'block');
                                //$('#result').parent().css('display', 'none');
                                //$('#tree').parent().css('display', 'block'); 
                                dojo.byId('floatPane').style.display = 'block';
                                dojo.byId('resultdiv').style.display = 'none';
                                dojo.byId('treediv').style.display = 'block';
                                break;
                        }
                    });
                
                $('.toolbar-icons a').on('click',
                    function (event) {
                        switch ($(this).attr("id")) {
                            case 'menu-bar-chart':
                                //$('#floatPane').css('display', 'block'); 
                                //$('#result').parent().css('display', 'block'); 
                                //$('#tree').parent().css('display', 'none'); 
                                dojo.byId('floatPane').style.display = 'block';
                                dojo.byId('resultdiv').style.display = 'block';
                                dojo.byId('treediv').style.display = 'none';
                                //require(['atide/myModule'], function (myModule) { myModule.setText('result', 'hello11111'); });
                                break;
                            case 'menu-bars':
                                //$('#floatPane').css('display', 'block');
                                //$('#result').parent().css('display', 'none');
                                //$('#tree').parent().css('display', 'block'); 
                                dojo.byId('floatPane').style.display = 'block';
                                dojo.byId('resultdiv').style.display = 'none';
                                dojo.byId('treediv').style.display = 'block';
                                break;
                            case 'menu-window-close-o':
                                dojo.byId('floatPane').style.display = 'none';
                                dojo.byId('resultdiv').style.display = 'none';
                                dojo.byId('treediv').style.display = 'none';
                                break;
                        }
                    }
                );
                $('.tool-common').toolbar({
                    content: '#tool-common',
                    position: 'left',
                    style: 'primary'
                });
            },
      

        //初始化菜单栏
        //initMenu: function () {
        //    var that = this;
        //    require(["atide/gis/tool/xml"], function (xmlConfig) {
        //        var config = new xmlConfig({ path: baseUrl + "data/config/Menu.xml", root: "Menu" });
        //        config.search({ "isvalid": "1" }, function (items, request) {
        //            for (var i = 0; i < items.length; i++) {
        //                var item = items[i];
        //                var title = config._store.getValue(item, "title");
        //                var id = config._store.getValue(item, "id");
        //                var image = config._store.getValue(item, "image");
        //                var style = config._store.getValue(item, "style");

        //                //var li = document.createElement("li");
        //                //li.id = id;
        //                //li.oclick = function () { that.menuChange(para); };
        //                //li.innerHTML = "<a><img src=\"" + image + "\" /><br />" + title + "</a>";
        //                var li = "<li id=\"" + id + "\" style=\"" + style + "\"><a><img src=\"" + image + "\" /><br />" + title + "</a></li>";
        //                $("#systemMenu").append(li);
        //                //document.getElementById(id).onclick = function () { that.menuChange(para); };
        //                $('#' + id).click(function () {
        //                    that._menuType = this.id;
        //                    //if (g_Main._middleLayout.state.east.isHidden) {
        //                        that.menuChange(this.id);
        //                    //}
        //                    //else {
        //                    //    g_Main._middleLayout.hide('east');
        //                    //}
                            
        //                });
        //            }
        //        });
        //    });
        //},

        //菜单栏点击响应函数
        //menuChange: function (menuType) {

            
        //},

    });

});

