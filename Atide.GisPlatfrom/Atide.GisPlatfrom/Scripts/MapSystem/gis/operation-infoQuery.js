
var selectCode;
var querytoolbar;
var display;
var whichfun;
function queryNodebyCode(code)    //树于行政区列表 点击触发
{
    cleanALL();
    selectCode = code;
    //query XZQ feature

    require(["esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent",
    "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query",
    "esri/tasks/QueryTask", "atide/gis/config/system-config", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/symbols/SimpleFillSymbol", "esri/symbols/CartographicLineSymbol", "dojo/domReady!"],
         function (Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, SystemConfig, SimpleMarkerSymbol, Color, SimpleFillSymbol, CartographicLineSymbol) {


           

             var fillsymbol = new SimpleFillSymbol(          //点选行政区颜色
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOT,
              new Color([122, 55, 139]), 1),
                 new Color([216, 23, 232, 0.1]));





             var url1 = "http://220.165.247.91:6080/arcgis/rest/services/XZQH/MapServer/0";
             var queryTask1 = new QueryTask(url1);
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
                  displayTB(code)
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




function queryTool(kind, isSta) {
    whichfun = isSta;
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
          

            function addqueryToMap(evt) {
                var symbol;
                querytoolbar.deactivate();
                // this._map.showZoomSlider();
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
                queryGeo(evt.geometry)
           

            }
        }




        querytoolbar.activate(Draw[tool]);


    });


}

function queryGeo(geometry)
{
    if (whichfun != 1) {
        queryByGeometry(geometry)
    }
    else {
        StaByGeometry(geometry)
    }
}

function queryAtt(value, field, isSta) {
    if (myFeatureLayer == null) {
        alert("请先选择图斑");
        return;
    }
    if (value == "") {
        alert("请输入查寻值");
        return;
    }

    var where = field + "='" + value + "'"
   
    if (isSta != 1) {
        queryByAtt(where);
    }
    else {
        StaByAtt(where);
    }

}


function queryByGeometry(geometry) {


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

function StaByGeometry(geometry) {


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

                       registry.byId("TC2").selectChild("RES2", true);
                       var div2 = document.getElementById("RES2")
                       
                   var scN = 0;
                   var fsN = 0;
                   var ptN = 0;
                   for (var i = 0; i < features.length; i++) {
                       switch (features[i].attributes.SSNYDLX) {
                           case "生产设施用地": scN++; break;
                           case "附属设施用地": fsN++; break;
                           case "配套设施用地": ptN++; break;
                       }

                   }


                   div2.innerHTML = "<div>生产设施用地图斑数量：" + scN
                       + "</br> 附属设施用地图斑数量：" + fsN
                       + "</br> 配套设施用地图斑数量：" + ptN
                       + "</div>";
             

           });


       });

}

function queryByAtt(where) {


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


function StaByAtt(where) {


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


                       registry.byId("TC4").selectChild("RES4", true);;
                      var div2 = document.getElementById("RES4")
                 
                   var scN = 0;
                   var fsN = 0;
                   var ptN = 0;
                   for (var i = 0; i < features.length; i++) {
                       switch (features[i].attributes.SSNYDLX) {
                           case "生产设施用地": scN++; break;
                           case "附属设施用地": fsN++; break;
                           case "配套设施用地": ptN++; break;
                       }

                   }


                   div2.innerHTML = "<div>生产设施用地图斑数量：" + scN
                       + "</br> 附属设施用地图斑数量：" + fsN
                       + "</br> 配套设施用地图斑数量：" + ptN
                       + "</div>";


           






           });


       });

}

