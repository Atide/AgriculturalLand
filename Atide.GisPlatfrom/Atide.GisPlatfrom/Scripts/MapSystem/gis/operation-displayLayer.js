var myFeatureTable = null;

function displayTB(year,where)
{
    require(["esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/layers/TableDataSource",
          "esri/layers/LayerDataSource", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
    "esri/Color", "dojo/domReady!"],
        function ( FeatureLayer, InfoTemplate, TableDataSource, LayerDataSource, SimpleFillSymbol, SimpleRenderer, Color) {
            if (g_main._mapControl._map.getLayer("TBlayer") != null) {
                g_main._mapControl._map.removeLayer(g_main._mapControl._map.getLayer("TBlayer"));
             
            }

            if (where == null)
            {
                alert("请选择行政区");
                return;
            }

            var infoTemplate = new InfoTemplate("标题", "${*}");
                  
                var dataSource = new TableDataSource();
             
                dataSource.workspaceId = "test1";
             
        
                dataSource.dataSourceName = "YGHC-"+year+".shp";
               
                var layerSource = new LayerDataSource();
               
                layerSource.dataSource = dataSource;
            
                var Flayer = new FeatureLayer("http://172.16.1.141:6080/arcgis/rest/services/test/MapServer/dynamicLayer", {
                    id:"TBlayer",
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"],
                    source: layerSource,
                     infoTemplate: infoTemplate,
                });
            
                var renderer = new SimpleRenderer(
      new SimpleFillSymbol("solid", null, new Color([10, 255,10, 0.85]) 
    ));

                Flayer.setDefinitionExpression("XZQDM= '"+where+"'");
             
                Flayer.setRenderer(renderer);
                Flayer.refresh();
                g_main._mapControl._map.addLayer(Flayer);
          

        }
      );
}




function displayBAXMtable(where) {
    
    require(["esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/layers/TableDataSource",
          "esri/layers/LayerDataSource", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer","esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/Color", "esri/dijit/FeatureTable", "dojo/dom-construct","esri/layers/DynamicLayerInfo","esri/layers/TableDataSource","esri/layers/LayerDataSource", "esri/layers/LayerDrawingOptions","dojo/domReady!"],
        function (FeatureLayer, InfoTemplate, TableDataSource, LayerDataSource, SimpleFillSymbol, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, Color, FeatureTable, domConstruct, DynamicLayerInfo, TableDataSource, LayerDataSource, LayerDrawingOptions) {
           
          




            if (where == null) {
                alert("请选择行政区");
                return;
            }

            var infoTemplate = new InfoTemplate("标题", "${*}");
            var dataSource = new TableDataSource();
            dataSource.workspaceId = "BAXM";
            dataSource.dataSourceName = "BAXY.shp";
            var layerSource = new LayerDataSource();
            layerSource.dataSource = dataSource;

            //http://172.16.1.141:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer 内网网址
            //外网地址 http://220.165.247.91:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer
            var Flayer = new FeatureLayer("http://172.16.1.141:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer", {
                id: "BAXMlayer",
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],
              source: layerSource,
                infoTemplate: infoTemplate,
            });
          

         Flayer.setDefinitionExpression("XZQDM= '" + where + "'");

      

        loadTable();

            function loadTable() {

                if (myFeatureTable != null) {
                    myFeatureTable.destroy();
                    myFeatureTable = null;
                }

                // create new FeatureTable and set its properties 
                myFeatureTable = new FeatureTable({
                    featureLayer: Flayer,
                    map:g_main._mapControl._map,
                    showAttachments: false,              
                    syncSelection: true,
                    zoomToSelection: true,
                    showGridMenu: false,
                    editable: false,
                    showColumnHeaderTooltips: false,
                    showCyclicalRelationships: false,
                    showFeatureCount: false,
                    showStatistics:false,
                    outFields: ["*"],
     

                    //fieldInfos: [
                    //  {
                    //      name: 'Building_Size_Sqft',
                    //      alias: 'Building Size',
                    //      editable: false,
                    //      format: {
                    //          template: "${value} sqft"
                    //      }
                    //  },
                    //  {
                    //      name: 'Available_Size_Sqft',
                    //      alias: 'Available Size',
                    //      format: {
                    //          template: "${value} sqft"
                    //      }
                    //  },
                    //  {
                    //      name: 'Primary_Parking_Type',
                    //      format: {
                    //          template: "${value} parking"
                    //      }
                    //  }
                    //],
                }, domConstruct.create('div', { id: 'myTableNode' }, 'floatPane'));

            
          
                myFeatureTable.startup();
          

                //点击表格后 获取所选 features
                myFeatureTable.on("row-select", function (evt) {
                    myFeatureTable.getFeatureDataById(myFeatureTable.selectedRowIds).then(function (features) {
                        console.log("features", features);
                    });
                
                });
              
            }















        }
      );
}



function displayBAXMlayer(where)
{

    if (g_main._mapControl._map.getLayer("BAXMlayer") != null) {
        g_main._mapControl._map.removeLayer(g_main._mapControl._map.getLayer("BAXMlayer"));

    }

    var BAXMlayer;

    require([
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/DynamicLayerInfo", "esri/layers/LayerDataSource",
    "esri/layers/LayerDrawingOptions", "esri/layers/TableDataSource",
    "esri/Color", "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "dojo/dom", "dojo/dom-construct", "dojo/dom-style",
    "dojo/query", "dojo/on",
    "dojo/parser", "dojo/_base/array", "dojo/dnd/Source", "dijit/registry", "esri/symbols/SimpleMarkerSymbol",
    "dijit/form/Button", "dojo/domReady!"
    ], function (
       ArcGISDynamicMapServiceLayer,
       DynamicLayerInfo, LayerDataSource,
       LayerDrawingOptions, TableDataSource,
       Color, SimpleRenderer,
       SimpleFillSymbol, SimpleLineSymbol,
       dom, domConstruct, domStyle,
       query, on, parser, arrayUtils, Source, registry, SimpleMarkerSymbol
    ) {
       

        var dynamicLayerInfos;





        BAXMlayer = new ArcGISDynamicMapServiceLayer("http://172.16.1.141:6080/arcgis/rest/services/BAXM/MapServer", {
            "id": "BAXMlayer"
        });


        g_main._mapControl._map.addLayer(BAXMlayer);

      
        dynamicLayerInfos = BAXMlayer.createDynamicLayerInfosFromLayerInfos();
     
        var layerName = "BAXY.shp";
     
        var dynamicLayerInfo = new DynamicLayerInfo();
        dynamicLayerInfo.id = dynamicLayerInfos.length;
        dynamicLayerInfo.name = layerName;
     
        var dataSource = new TableDataSource();
        dataSource.workspaceId = "BAXM"; // not exposed via REST :(
        dataSource.dataSourceName = layerName;
        // and now a layer source
        var layerSource = new LayerDataSource();
        layerSource.dataSource = dataSource;
        dynamicLayerInfo.source = layerSource;
        dynamicLayerInfos.push(dynamicLayerInfo);


        BAXMlayer.setDynamicLayerInfos(dynamicLayerInfos, true);

        var sms = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 15,
new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
new Color([113, 169, 254, 0.5]), 5),
new Color([13, 203, 242]));
        sms.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        var drawingOptions = new LayerDrawingOptions();
        drawingOptions.renderer = new SimpleRenderer(sms);

     
        //drawingOptions.renderer = new SimpleRenderer(
        //   new SimpleFillSymbol("solid", null,
        //      new Color([0, 150, 255, 1])
        //   ));
        var options = [];
     
        options[0] = drawingOptions;
        BAXMlayer.setLayerDrawingOptions(options);

        var layerDefinitions = [];
        layerDefinitions[0] ="XZQDM='"+where+"'";
        BAXMlayer.setLayerDefinitions(layerDefinitions);







    });

}


