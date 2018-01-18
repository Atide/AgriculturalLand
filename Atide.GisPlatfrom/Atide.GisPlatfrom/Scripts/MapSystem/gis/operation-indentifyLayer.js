/**
 * Created by 黄冠睿 on 2017/08/06
 * 底图识别层类
 */


var _objEventTB = {  //图斑识别事件记录
    indentifyEventTB2014: null,
    indentifyEventTB2015: null,
    indentifyEventTB2016: null,
    indentifyEventTB2017: null,
    indentifyEventTB2018: null
};
function switchEventTB(where,layerinfos,year) {   //开启图斑 识别层

    require(["atide/gis/config/system-config", "esri/renderers/SimpleRenderer", "esri/layers/LayerDrawingOptions", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/symbols/SimpleMarkerSymbol"],
    function (SystemConfig, SimpleRenderer, LayerDrawingOptions, SimpleLineSymbol, SimpleFillSymbol, Color, SimpleMarkerSymbol) {
        var layersId;
        var url;


        layersId = 0; url = SystemConfig.urlConfig.tbServiceUrl;

        var layerDefinitions;
        if (where != null) {
            layerDefinitions = [];
            layerDefinitions[layersId] = where;
        }


     
        require([
            "esri/tasks/IdentifyTask",
            "esri/tasks/IdentifyParameters",
            "dojo/domReady!"
        ], function (IdentifyTask, IdentifyParameters) {
           

            var identifyTask, identifyParams;
            identifyTask = new IdentifyTask(url);
            identifyParams = new IdentifyParameters();
            identifyParams.tolerance = 3;
            identifyParams.returnGeometry = true;
            identifyParams.layerIds = [layersId];
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.width = g_main._mapControl._map.width;
            identifyParams.height = g_main._mapControl._map.height;
            identifyParams.dynamicLayerInfos = layerinfos;
            if (layerDefinitions != null) {
                identifyParams.layerDefinitions = layerDefinitions
            }


            _objEventTB["indentifyEventTB" + year] = g_main._mapControl._map.on("click", executeIdentifyTask);

            function executeIdentifyTask(event) {
                identifyParams.geometry = event.mapPoint;
                identifyParams.mapExtent = g_main._mapControl._map.extent;
                identifyTask.execute(identifyParams);
            }

            identifyTask.on("complete", function (event) {
                var response = event.results;
                if (response.length != 0) {



                    displayBYfeature(response[0].feature, "TB",year)





                }
            })





        });



    })

}


