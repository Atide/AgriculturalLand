

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



function displayBAXM(where) {
    require(["esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/layers/TableDataSource",
          "esri/layers/LayerDataSource", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer","esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/Color", "esri/dijit/FeatureTable", "dojo/domReady!"],
        function (FeatureLayer, InfoTemplate, TableDataSource, LayerDataSource, SimpleFillSymbol, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, Color, FeatureTable) {
            if (g_main._mapControl._map.getLayer("BAXMlayer") != null) {
                g_main._mapControl._map.removeLayer(g_main._mapControl._map.getLayer("BAXMlayer"));

            }

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

            var Flayer = new FeatureLayer("http://172.16.1.141:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer", {
                id: "BAXMlayer",
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"],
                source: layerSource,
                infoTemplate: infoTemplate,
            });
            var sms = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 15,
                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                      new Color([113, 169, 254, 0.5]), 5),
                  new Color([13, 203, 242]));
            sms.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
            var renderer = new SimpleRenderer(sms);

            Flayer.setDefinitionExpression("XZQDM= '" + where + "'");

            var selectionSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12,
                       new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 197, 1])));


            Flayer.setSelectionSymbol(selectionSymbol);
            Flayer.setRenderer(renderer);
            Flayer.refresh();
            g_main._mapControl._map.addLayer(Flayer);



            loadTable();





            function loadTable() {
             


                // create new FeatureTable and set its properties 
                var myFeatureTable = new FeatureTable({
                    featureLayer: Flayer,
                    map:g_main._mapControl._map,
                    showAttachments: true,
                    // only allows selection from the table to the map 
                    syncSelection: true,
                    zoomToSelection: true,
                    gridOptions: {
                        allowSelectAll: true,
                        allowTextSelection: true,
                    },
                    editable: false,
                    dateOptions: {
                        // set date options at the feature table level 
                        // all date fields will adhere this 
                        datePattern: "MMMM d, y"
                    },
                    // define order of available fields. If the fields are not listed in 'outFields'
                    // then they will not be available when the table starts. 
                    outFields: ["*"],
                    // use fieldInfos property to change field's label (column header), 
                    // the editability of the field, and to format how field values are displayed

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
                }, 'myTableNode');

                myFeatureTable.startup();

                // listen to show-attachments event

            }















        }
      );
}