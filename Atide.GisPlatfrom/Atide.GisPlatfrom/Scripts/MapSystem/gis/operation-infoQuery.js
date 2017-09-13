var selectYear = 2015;
var selectCode;


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
                 centerShowGraphic(feature);
                 displayBAXMtable(code);
                 displayBAXMlayer(code);
 



           


             })







         });




}

function cleanALL()
{
    g_main._mapControl._map.graphics.clear();
    g_main._mapControl._map.infoWindow.hide();
    selectCode = null;
}