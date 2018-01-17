//*********************************************************
//*****工具方法 图层操作万能方法 by黄冠睿******************
//*********************************************************





function operationLayer(Type, layerID, mapInstance, opacity, serverURL, displayLayerList, layerDefinitions, layerDrawingoptions) {   //Universal and powerful layer operation method by HuangGuanrui

    require([
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "dojo/_base/array",
        "esri/InfoTemplate"
    ], function (ArcGISDynamicMapServiceLayer, IdentifyTask, IdentifyParameters, arrayUtils, InfoTemplate) {
        switch (Type) {
            case "open": open(); break;
            case "close": colse(); break;
            case "update": update(); break;
            case "change": change(); break;
        }

        function colse() {
            if (mapInstance.getLayer(layerID) != null) {
                mapInstance.removeLayer(mapInstance.getLayer(layerID));
                return;
            }
        }

        function open() {
            var opts = {
                "id": layerID,
                "opacity": opacity
            };

            var cacheOperationLayer = new ArcGISDynamicMapServiceLayer(serverURL, opts);
            if (displayLayerList != null) {
                cacheOperationLayer.setVisibleLayers(displayLayerList);
            }

            if (layerDefinitions != null) {
                cacheOperationLayer.setLayerDefinitions(layerDefinitions);
            }
            if (layerDrawingoptions != null) {
                cacheOperationLayer.setLayerDrawingOptions(layerDrawingoptions);
            }


            mapInstance.addLayer(cacheOperationLayer);
        }

        function update() {
            if (mapInstance.getLayer(layerID) != null) {
                mapInstance.removeLayer(mapInstance.getLayer(layerID));
                open();
            }
            else {
                open();
            }
        }

        function change() {
            if (mapInstance.getLayer(layerID) != null) {
                mapInstance.removeLayer(mapInstance.getLayer(layerID));
                return;
            }
            else {
                open();
            }
        }


    });


}


function displayFeature(ContainerLayer, mapInstance, feature, symbol, infoTemplate, isShowTemplate)    ////Universal and powerful display feature method by HuangGuanrui
{

    require(["esri/graphic", "esri/InfoTemplate", "esri/SpatialReference", "esri/geometry/Extent",
       "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/symbols/CartographicLineSymbol", "esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "esri/symbols/SimpleFillSymbol", "dojo/domReady!"],
            function (Graphic, InfoTemplate, SpatialReference, Extent, GraphicsLayer, SimpleLineSymbol, CartographicLineSymbol, Color, SimpleMarkerSymbol, Color, SimpleFillSymbol) {
                centerShowGraphic(feature);

                if (ContainerLayer == 1) {
                    mapInstance.graphics.clear();
                }
                else {
                    if (ContainerLayer.length > 0) {
                        delLayers(ContainerLayer);
                    }
                }
                if (ContainerLayer == 1) {

                    var highfeature = feature;
                    highfeature.setSymbol(symbol);
                    if (infoTemplate != null) {
                        highfeature.setInfoTemplate(infoTemplate);
                    }

                    mapInstance.graphics.add(highfeature);


                }
                else {
                    var cacheGraphicsLayer = new GraphicsLayer();

                    var highfeature = feature;
                    highfeature.setSymbol(symbol);
                    if (infoTemplate != null) {
                        highfeature.setInfoTemplate(infoTemplate);
                    }
                    cacheGraphicsLayer.add(highfeature);
                    mapInstance.addLayer(cacheGraphicsLayer);
                    ContainerLayer.push(cacheGraphicsLayer);

                    if (isShowTemplate != false) {
                        cacheGraphicsLayer.on("mouse-over", function (event) {
                            mapInstance.graphics.clear();
                            var graphic = event.graphic;
                            mapInstance.infoWindow.setContent(graphic.getContent());
                            mapInstance.infoWindow.setTitle(graphic.getTitle());
                            mapInstance.infoWindow.show(event.screenPoint,
                            mapInstance.getInfoWindowAnchor(event.screenPoint));
                        });

                        //鼠标离开产生的事件
                        cacheGraphicsLayer.on("mouse-out", function () {
                            mapInstance.graphics.clear();
                            //   mapInstance.infoWindow.hide();
                        });
                    }







                }
            });

}


function setExtentbyXY(mapInstance, x, y, level) {
    require([
  "esri/geometry/Point", "esri/SpatialReference"], function (Point, SpatialReference) {
      var location = new Point(x, y, new SpatialReference({ wkid: 4326 }));
      mapInstance.centerAndZoom(location, level);
  });


}


function setExtentbyExtent(mapInstance, xmin, ymin, xmax, ymax) {
    require([
 "esri/geometry/Extent", "esri/SpatialReference"], function (Extent, SpatialReference) {
     var extent = new Extent(xmin, ymin, xmax, ymax, new SpatialReference({ wkid: 4326 }));
     mapInstance.setExtent(extent, true);
 });


}
