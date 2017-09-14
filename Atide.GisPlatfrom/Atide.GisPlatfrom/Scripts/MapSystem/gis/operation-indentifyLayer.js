/**
 * Created by 黄冠睿 on 2017/08/06
 * 底图识别层类
 */


var _objEvent = {
    indentifyEventBAXM: null,
    indentifyEventTB: null
};
function switchEvent(kind, where,layerinfos) {



    require(["esri/renderers/SimpleRenderer", "esri/layers/LayerDrawingOptions", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/symbols/SimpleMarkerSymbol"], function (SimpleRenderer, LayerDrawingOptions, SimpleLineSymbol, SimpleFillSymbol, Color, SimpleMarkerSymbol) {
        var layersId;
        var url;





        switch (kind) {
            case "TB": layersId = 0; url = "http://172.16.1.141:6080/arcgis/rest/services/test/MapServer"; break;
            case "BAXM": layersId = 0; url = "http://172.16.1.141:6080/arcgis/rest/services/BAXM/MapServer"; break;


        }
        var layerDefinitions;
        if (where != null) {
            layerDefinitions = [];
            layerDefinitions[layersId] = where;
        }


     
        identifyControl("open", _objEvent, g_main._mapControl._map, g_main._mapControl._map, url, 3, layersId, layerDefinitions, layerinfos, kind);  //开启查询      



    })

}



function identifyControl(Type, eventInstance, subject, mapInstance, url, tolerance, layerIds, layerDefinitions, layerinfos, kind) {   //Universal and powerful identify operation method by HuangGuanrui
    require([
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "dojo/domReady!"
    ], function (IdentifyTask, IdentifyParameters) {
        var eventObj;
        
        switch(kind)
        {
            case "TB": eventObj = eventInstance.indentifyEventTB; break;
            case "BAXM": eventObj = eventInstance.indentifyEventBAXM; break;
        }
        if (eventObj != null) {
            eventObj.remove();
        }

        switch (Type) {
            case "open": open(); break;
            case "close": close(); break;
            case "update": update(); break;
            case "change": change(); break;
        }

        function open() {


            var identifyTask, identifyParams;
            identifyTask = new IdentifyTask(url);
            identifyParams = new IdentifyParameters();
            identifyParams.tolerance = tolerance;
            identifyParams.returnGeometry = true;
            identifyParams.layerIds = [layerIds];
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.width = mapInstance.width;
            identifyParams.height = mapInstance.height;
            identifyParams.dynamicLayerInfos = layerinfos;
            if (layerDefinitions != null) {
                identifyParams.layerDefinitions = layerDefinitions
            }


            eventObj = subject.on("click", executeIdentifyTask);

            function executeIdentifyTask(event) {
                identifyParams.geometry = event.mapPoint;
                identifyParams.mapExtent = mapInstance.extent;
                identifyTask.execute(identifyParams);
            }

            identifyTask.on("complete", function (event) {
                var response = event.results;
                if (response.length != 0) {
                 
         
             
                    displayBYfeature(response[0].feature, kind)
                   
                 
                            
                    

                }
            })

        }


        function close() {
            if (eventInstance.indentifyEventBAXM != null) {
                eventInstance.indentifyEventBAXM.remove();
            }
            if (eventInstance.indentifyEventTB != null) {
                eventInstance.indentifyEventTB.remove();
            }

        }


    });








}