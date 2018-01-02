
var selectCode;
var querytoolbar;
var display;
var whichfun;
var whichField;
function queryNodebyCode(code)    //树于行政区列表 点击触发
{
    cleanALL();
    selectCode = code;
    //query XZQ feature

    require(["atide/gis/config/system-config", "esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent",
    "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query",
    "esri/tasks/QueryTask", "atide/gis/config/system-config", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/symbols/CartographicLineSymbol", "dojo/domReady!"],
         function (SystemConfig, Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, SystemConfig, SimpleMarkerSymbol, Color, SimpleFillSymbol, CartographicLineSymbol) {


           

             var fillsymbol = new SimpleFillSymbol(          //点选行政区颜色
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOT,
              new Color([122, 55, 139]), 1),
                 new Color([216, 23, 232, 0.1]));


             var queryTask1 = new QueryTask(SystemConfig.urlConfig.xzqQueryUrl);
             var query1 = new Query();
             query1.returnGeometry = true;
             query1.outFields = ["*"];
             query1.outSpatialReference = { "wkid": 4326 };
             query1.where = "CODE='" + code + "'";//查询的sql语句
             queryTask1.execute(query1);
             queryTask1.on("complete", function (event) {       
                 var feature = event.featureSet.features[0];
                 displayFeature(pointlayers, g_main._mapControl._map, feature, fillsymbol, null, false);
                 showResultPane();
                 var ext = feature.geometry.getExtent();
                 var res = g_main._mapControl._map.setExtent(ext.expand(1.5));
             
              res.promise.then(function (results) {
                  //displayBAXM(code)
                 
                  displayTB(code, getSelectTime())
              });
             })







         });




}

function cleanALL()
{
    g_main._mapControl._map.graphics.clear();
    g_main._mapControl._map.infoWindow.hide();
    selectCode = null;

    if (BAXMfeatureLayers.length > 0) {
        delLayers(BAXMfeatureLayers);
    }

    if (g_main._mapControl._map.getLayer("TBlayer") != null) {
        g_main._mapControl._map.removeLayer(g_main._mapControl._map.getLayer("TBlayer"));

    }

    identifyControl("close", _objEvent);

}




function queryTool(kind, isSta,stField) {   //空间画图工具 触发
    whichfun = isSta;
    whichField = stField;
    require([
  "esri/toolbars/draw", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/TextSymbol", "esri/graphic"
    ], function (Draw, SimpleLineSymbol, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol, TextSymbol, Graphic) {
        if (myFeatureLayer == null)
        {
            alert("请先选择图斑");
            return;
        }
        var tool = kind.toUpperCase().replace(/ /g, "_");
        if (querytoolbar == null) {
            querytoolbar = new Draw(g_main._mapControl._map);
            querytoolbar.on("draw-end", addqueryToMap);     
        }


        function addqueryToMap(evt) {
            var symbol;
            querytoolbar.deactivate();

            switch (evt.geometry.type) {
                case "point":
                case "multipoint":
                    symbol = new SimpleMarkerSymbol();
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol();
                    break;
                default:
                    symbol = new SimpleFillSymbol();
                    break;
            }
            var graphic = new Graphic(evt.geometry, symbol);
            g_main._mapControl._map.graphics.clear();
            g_main._mapControl._map.graphics.add(graphic);


            if (whichfun != 1) {
                queryByGeometry(evt.geometry)   //空间 查询
            }
            else {
                StaByGeometry(evt.geometry)  //空间 统计
            }
          


        }


        querytoolbar.activate(Draw[tool]);


    });


}







function queryByGeometry(geometry) {  //空间查询


    require(["dijit/registry","esri/layers/FeatureLayer","esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent",
  "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query",
  "esri/tasks/QueryTask", "atide/gis/config/system-config", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/symbols/CartographicLineSymbol", "dojo/domReady!"],
       function (registry,FeatureLayer, Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, SystemConfig, SimpleMarkerSymbol, Color, SimpleFillSymbol, CartographicLineSymbol) {


         
           var query1 = new Query();
           query1.returnGeometry = true;
           query1.outFields = ["*"];
           query1.outSpatialReference = { "wkid": 4326 };
       
               query1.geometry = geometry;
          
         
           myFeatureLayer.selectFeatures(query1, FeatureLayer.SELECTION_NEW, function (event) {
               if (event.length ==0) {
                   alert("查询为空")
                   return;
               }
               var features = event;


                   //点击列表方法
                   display = function (i) {    
                       registry.byId("TC1").selectChild("RES1", true);
                       var div2 = document.getElementById("RES1");
                       div2.innerHTML = "<div>图斑标识码：" + features[i].attributes.BSM
                           + "</br> 所在行政区代码：" + features[i].attributes.XZQDM
                           + "</br> 图斑说明：" + features[i].attributes.SM
                           + "</div>";
                       var ext = features[i].geometry.getExtent();
                       var res = g_main._mapControl._map.setExtent(ext.expand(1.5));
                   }



                   var div = document.getElementById("QU11");
                   div.innerHTML = "<div>查询结果：" + features.length + "个</div>";

                   for (var i = 0; i < features.length; i++) {
                       div.innerHTML += "<div onclick='display(" + i + ")'>图斑标识码：" + features[i].attributes.BSM + ", 所在行政区代码：" + features[i].attributes.XZQDM
                           + "</div>"                  }
           });
       });

}

function StaByGeometry(geometry) {   //空间统计


    require(["dijit/registry", "esri/layers/FeatureLayer", "esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent",
  "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query",
  "esri/tasks/QueryTask", "atide/gis/config/system-config", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/symbols/CartographicLineSymbol", "dojo/domReady!"],
       function (registry, FeatureLayer, Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, SystemConfig, SimpleMarkerSymbol, Color, SimpleFillSymbol, CartographicLineSymbol) {



           var query1 = new Query();
           query1.returnGeometry = true;
           query1.outFields = ["*"];
           query1.outSpatialReference = { "wkid": 4326 };
           
           query1.geometry = geometry;
           
         
           myFeatureLayer.selectFeatures(query1, FeatureLayer.SELECTION_NEW, function (event) {
               if (event.length ==0) {
                   alert("查询为空")
                   return;
               }
               var features = event;
               for (var i = 0; i < features.length; i++) {
                   features[i] = features[i].attributes

               }
                       registry.byId("TC2").selectChild("RES2", true);
                    
                       
                       var res = toClassify(features, whichField)   //根据所选字段 统计
                       var Xdata = new Array();
                       var Ydata = new Array();
                       for (var i = 0; i < res.length; i++)
                       {
                           Xdata.push(res[i].Field);
                           Ydata.push(res[i].data.length);
                       }


                       var myChart = echarts.init(document.getElementById('geoSta'));
                                            var option = {                           title: {                               text: whichField+ '情况统计'                           },                                                     tooltip: {},                                                   xAxis: {                               data: Xdata,                               axisLabel : {
                                   interval: 0
                               } ,                           },                           yAxis: {},                           series: [{                               name: '图斑数量',                               type: 'bar',                               data: Ydata                           }]                       };
                                         myChart.setOption(option);


                    
             

           });


       });

}

function queryByAtt(value, field) {  //属性查询


    if (myFeatureLayer == null) {
        alert("请先选择图斑");
        return;
    }
    if (value == "") {
        alert("请输入查寻值");
        return;
    }
    var where = field + "='" + value + "'"

    require(["dijit/registry", "esri/layers/FeatureLayer", "esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent",
  "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query",
  "esri/tasks/QueryTask", "atide/gis/config/system-config", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/symbols/CartographicLineSymbol", "dojo/domReady!"],
       function (registry, FeatureLayer, Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, SystemConfig, SimpleMarkerSymbol, Color, SimpleFillSymbol, CartographicLineSymbol) {
    


           var query1 = new Query();
           query1.returnGeometry = true;
           query1.outFields = ["*"];
           query1.outSpatialReference = { "wkid": 4326 };
        
           query1.where = where;
      
           myFeatureLayer.selectFeatures(query1, FeatureLayer.SELECTION_NEW, function (event) {

               if (event.length == 0)
               {
                   alert("查询为空")
                   return;
               }


               var features = event;

 
                   //点击列表方法                  
                   display = function (i) {
                       registry.byId("TC3").selectChild("RES3", true);
                       var div2 = document.getElementById("RES3");
                       div2.innerHTML = "<div>图斑标识码：" + features[i].attributes.BSM
                           + "</br> 所在行政区代码：" + features[i].attributes.XZQDM
                           + "</br> 图斑说明：" + features[i].attributes.SM
                           + "</div>";

                       var ext = features[i].geometry.getExtent();
                       var res = g_main._mapControl._map.setExtent(ext.expand(1.5));
                   }

                   var div = document.getElementById("QU31");
                   div.innerHTML = "<div>查询结果：" + features.length + "个</div>";
                   var length = features.length < 40 ? features.length : 40;
                   for (var i = 0; i < length; i++) {
                       div.innerHTML += "<div onclick='display(" + i + ")'>图斑标识码：" + features[i].attributes.BSM + ", 所在行政区代码：" + features[i].attributes.XZQDM
                           + "</div>"
                   }
               






           });


       });

}


function StaByAtt(value, field, stField) {  //属性统计
    if (myFeatureLayer == null) {
        alert("请先选择图斑");
        return;
    }
    if (value == "") {
        alert("请输入查寻值");
        return;
    }
    var where = field + "='" + value + "'"

    require(["dijit/registry", "esri/layers/FeatureLayer", "esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent",
  "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query",
  "esri/tasks/QueryTask", "atide/gis/config/system-config", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/symbols/CartographicLineSymbol", "dojo/domReady!"],
       function (registry, FeatureLayer, Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, SystemConfig, SimpleMarkerSymbol, Color, SimpleFillSymbol, CartographicLineSymbol) {



           var query1 = new Query();
           query1.returnGeometry = true;
           query1.outFields = ["*"];
           query1.outSpatialReference = { "wkid": 4326 };        
               query1.where = where           
               myFeatureLayer.selectFeatures(query1, FeatureLayer.SELECTION_NEW, function (event) {
                   if (event.length == 0) {
                       alert("查询为空")
                       return;
                   }

               var features = event;
               for (var i = 0; i < features.length; i++) {
                   features[i] =features[i].attributes

               }

               registry.byId("TC4").selectChild("RES4", true);;
             
               var res = toClassify(features, stField)   //根据所选字段 统计

               var Xdata = new Array();
               var Ydata = new Array();
               for (var i = 0; i < res.length; i++) {
                   Xdata.push(res[i].Field);
                   Ydata.push(res[i].data.length);
               }


               var myChart = echarts.init(document.getElementById('attSta'));
               var option = {                   title: {                       text: whichField + '情况统计'                   },                   tooltip: {},                   xAxis: {                       data: Xdata,                       axisLabel : {
                           interval: 0
                       } ,                   },                   yAxis: {},                   series: [{                       name: '图斑数量',                       type: 'bar',                       data: Ydata                   }]               };
               myChart.setOption(option);

             

           });


       });

}

function getSelectTime() {   //获取选择时间 数组('2014','2015')
    var selStr = String($("#yearselect").val());
    var arr = selStr.split(',');
    var res="("
    for (var i = 0; i < arr.length; i++) {
        if (i == 0)
        {
            res += "'" + arr[i] + "'"
        }
        else {
            res += ",'" + arr[i] + "'"
        }
    }
    res+=")"
    return res;
}



function toClassify(arr, Field) {     



    var map = {},
        dest = [];
    for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        ai[Field] = ai[Field].replace(/\r/g, "");
        if (!map[ai[Field]]) {
            dest.push({
                Field: ai[Field],
                data: [ai]
            });
            map[ai[Field]] = 1;
        } else {
            for (var j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if (dj.Field == ai[Field]) {
                    dj.data.push(ai);
                    break;
                }
            }
            map[ai[Field]]++;
        }
    }
    return dest;
}