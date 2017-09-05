//*********************************************************
//******************工具类 arcgis操作模块******************
//*********************************************************
var linelayers = new Array();//用于删除已添加的层
var pointlayers = new Array();//用于删除已添加的点层




//递归删除已有层
function delLayers(Layers) {
    require(["esri/map", "esri/graphic", "dojo/on", "esri/layers/GraphicsLayer", "dojo/domReady!"

    ], function (Map, Graphic, on, GraphicsLayer) {
        var delLayer = Layers.pop();
        if (delLayer) {
            g_main._mapControl._map.removeLayer(delLayer);
        }
        if (Layers.length > 0) {
            delLayers(Layers);
        }
    });

}

//根据要素类的范围进行地图范围设置
function getFeatureSetExtent(features) {
    require(["esri/map", "esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent", "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query", "esri/tasks/QueryTask", "esri/Color", "dojo/domReady!"],
              function (Map, Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, Color) {
                  var resultUnionExtent = null;
                  var multipoint = new esri.geometry.Multipoint();

                  if (features.length == 1) {
                      centerShowGraphic(features[0]);
                  }
                  else {
                      for (var i = 0; i < features.length; i++) {

                          var feature = features[i];
                          if (feature.geometry.type == "point") {
                              multipoint.addPoint(feature.geometry);
                          }
                          else {
                              if (resultUnionExtent == null) {
                                  resultUnionExtent = feature.geometry.getExtent();
                              }
                              else {
                                  resultUnionExtent = resultUnionExtent.union(feature.geometry.getExtent());
                              }
                          }
                      }
                      if (multipoint.points.length > 0) {
                          if (resultUnionExtent == null) {
                              resultUnionExtent = multipoint.getExtent();
                          }
                          else {
                              resultUnionExtent = resultUnionExtent.union(multipoint.getExtent());
                          }
                      }
                      g_main._mapControl._map.setExtent(resultUnionExtent.expand(1.5));
                  }

              });
}

function centerShowGraphic(graphic) {
    require(["esri/map", "esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent", "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/tasks/query", "esri/tasks/QueryTask", "esri/Color", "dojo/domReady!"],
       function (Map, Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Query, QueryTask, Color) {
           switch (graphic.geometry.type) {
               case "point":
                   var level = map.getLevel();
                   if (level < 8) level = 8;
                   g_main._mapControl._map.centerAndZoom(graphic.geometry, level);
                   break;
               case "polyline":
                   var line = graphic.geometry.getExtent();
                   g_main._mapControl._map.setExtent(line.expand(1.5));
                   break;
               case "polygon":
                   var ext = graphic.geometry.getExtent();
                   g_main._mapControl._map.setExtent(ext.expand(1.5));
                   break;
           }
       });
}

_clusterLayer = null;





