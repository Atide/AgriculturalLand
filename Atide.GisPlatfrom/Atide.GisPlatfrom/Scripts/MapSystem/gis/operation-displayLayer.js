var myFeatureTable = null;
var myFeatureTable2 = null;
var myFeatureLayer = null;
//展示图斑
function displayTB(code,selectTime)   //点击树  展示图斑和属性表
{
    if (code == null) {
        alert("请选择行政区");
        return;
    }
    var where = "XZQDM like '" + code + "%'and TIME in" +selectTime;
    displayTBtable(where);  //展示图斑表
    displayTBlayer(where);//展示图斑 动态图层
    showHideYghcTable(1);
   //displayBAXM(code);
}
//展示备案项目
function displayBAXM(code, selectTime) {

    if (code == null) {
        alert("请选择行政区");
        return;
    }
    var where = "XZQDM like'" + code + "%' and BASJ in" + selectTime;
    displayBAXMtable(where);  //展示备案项目 表
    displayBAXMlayer(where);  //展示备案项目 图层


}

function displayTBtable(where)    
{
    require(["esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/layers/TableDataSource",
          "esri/layers/LayerDataSource", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/Color", "esri/dijit/FeatureTable", "dojo/dom-construct", "esri/layers/DynamicLayerInfo", "esri/layers/TableDataSource", "esri/layers/LayerDataSource", "esri/layers/LayerDrawingOptions", "dojo/domReady!"],
        function (FeatureLayer, InfoTemplate, TableDataSource, LayerDataSource, SimpleFillSymbol, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, Color, FeatureTable, domConstruct, DynamicLayerInfo, TableDataSource, LayerDataSource, LayerDrawingOptions) {
        

                  
                var dataSource = new TableDataSource();    
                dataSource.workspaceId = "test1";                   
                dataSource.dataSourceName = "YGHC.shp";            
                var layerSource = new LayerDataSource();            
                layerSource.dataSource = dataSource;
            
                var Flayer = new FeatureLayer("http://220.165.247.91:6080/arcgis/rest/services/test/MapServer/dynamicLayer", {
                    id:"TBtable",
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"],
                    source: layerSource,
                  
                });           
              Flayer.setDefinitionExpression(where);
             
                if (myFeatureTable2 != null) {
                    myFeatureTable2.destroy();
                    myFeatureTable2 = null;
                }

                myFeatureLayer = Flayer;
            // create new FeatureTable and set its properties 
                myFeatureTable2 = new FeatureTable({
                    featureLayer: Flayer,
                    map: g_main._mapControl._map,
                    showAttachments: false,
                    syncSelection: true,
                    zoomToSelection: true,
                    showGridMenu: false,
                    editable: false,
                    showColumnHeaderTooltips: false,
                    showCyclicalRelationships: false,
                    showFeatureCount: false,
                    showStatistics: false,
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
                }, domConstruct.create('div', { id: 'myTableNode2' }, 'yghcTableNode'));



                myFeatureTable2.startup();


            //点击表格后 获取所选 features
                myFeatureTable2.on("row-select", function (evt) {
                    myFeatureTable2.getFeatureDataById(myFeatureTable2.selectedRowIds).then(function (res) {              
                     displayBYfeature(res.features[0], "TB")   
                    });

                });



        }
      );
}

function displayTBlayer(where) {

    if (g_main._mapControl._map.getLayer("TBlayer") != null) {
        g_main._mapControl._map.removeLayer(g_main._mapControl._map.getLayer("TBlayer"));

    }
    var TBlayer;
    require([
    "esri/layers/ArcGISDynamicMapServiceLayer","esri/renderers/UniqueValueRenderer","atide/gis/config/system-config",
    "esri/layers/DynamicLayerInfo", "esri/layers/LayerDataSource",
    "esri/layers/LayerDrawingOptions", "esri/layers/TableDataSource",
    "esri/Color", "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "dojo/dom", "dojo/dom-construct", "dojo/dom-style",
    "dojo/query", "dojo/on",
    "dojo/parser", "dojo/_base/array", "dojo/dnd/Source", "dijit/registry", "esri/symbols/SimpleMarkerSymbol",
    "dijit/form/Button", "dojo/domReady!"
    ], function (
       ArcGISDynamicMapServiceLayer,UniqueValueRenderer, SystemConfig,
       DynamicLayerInfo, LayerDataSource,
       LayerDrawingOptions, TableDataSource,
       Color, SimpleRenderer,
       SimpleFillSymbol, SimpleLineSymbol,
       dom, domConstruct, domStyle,
       query, on, parser, arrayUtils, Source, registry, SimpleMarkerSymbol
    ) {


        var dynamicLayerInfos;





        TBlayer = new ArcGISDynamicMapServiceLayer("http://220.165.247.91:6080/arcgis/rest/services/test/MapServer", {
            "id": "TBlayer"
        });


        g_main._mapControl._map.addLayer(TBlayer);

        dynamicLayerInfos = TBlayer.createDynamicLayerInfosFromLayerInfos();
   


    
        var layerName = "YGHC.shp";

        var dynamicLayerInfo = new DynamicLayerInfo();
        dynamicLayerInfo.id = dynamicLayerInfos.length;
        dynamicLayerInfo.name = layerName;

        var dataSource = new TableDataSource();
        dataSource.workspaceId = "test1"; // not exposed via REST :(
        dataSource.dataSourceName = layerName;
        // and now a layer source
        var layerSource = new LayerDataSource();
        layerSource.dataSource = dataSource;
        dynamicLayerInfo.source = layerSource;
        dynamicLayerInfos.push(dynamicLayerInfo);


        TBlayer.setDynamicLayerInfos(dynamicLayerInfos, true);


        switchEvent("TB", where, dynamicLayerInfos);  //添加点击查询图层


        var defaultSymbol = SystemConfig.colorConfig.TBlayerColor;
        var renderer = new UniqueValueRenderer(defaultSymbol, "SSNYDLX");
        renderer.addValue("生产设施用地", SystemConfig.colorConfig.TBlayerColor2);
        renderer.addValue("附属设施用地", SystemConfig.colorConfig.TBlayerColor3);
        renderer.addValue("配套设施用地", SystemConfig.colorConfig.TBlayerColor4);



        var drawingOptions = new LayerDrawingOptions();
        drawingOptions.renderer = renderer;


        var options = [];

        options[0] = drawingOptions;
        TBlayer.setLayerDrawingOptions(options);

        var layerDefinitions = [];
        layerDefinitions[0] =where;
        TBlayer.setLayerDefinitions(layerDefinitions);







    });

}

function displayBAXMtable(where) {
    
    require(["esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/layers/TableDataSource",
          "esri/layers/LayerDataSource", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer","esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/Color", "esri/dijit/FeatureTable", "dojo/dom-construct","esri/layers/DynamicLayerInfo","esri/layers/TableDataSource","esri/layers/LayerDataSource", "esri/layers/LayerDrawingOptions","dojo/domReady!"],
        function (FeatureLayer, InfoTemplate, TableDataSource, LayerDataSource, SimpleFillSymbol, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, Color, FeatureTable, domConstruct, DynamicLayerInfo, TableDataSource, LayerDataSource, LayerDrawingOptions) {
           
     
            var dataSource = new TableDataSource();
            dataSource.workspaceId = "BAXM";
            dataSource.dataSourceName = "BAXY.shp";
            var layerSource = new LayerDataSource();
            layerSource.dataSource = dataSource;

            //http://172.16.1.141:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer 内网网址
            //外网地址 http://220.165.247.91:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer
            var Flayer = new FeatureLayer("http://220.165.247.91:6080/arcgis/rest/services/BAXM2/MapServer/dynamicLayer", {
                id: "BAXMtable",
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],
              source: layerSource,           
            });
          

            Flayer.setDefinitionExpression(where);

      
            if (myFeatureTable != null) {
                myFeatureTable.destroy();
                myFeatureTable = null;
            }

            // create new FeatureTable and set its properties 
            myFeatureTable = new FeatureTable({
                featureLayer: Flayer,
                map: g_main._mapControl._map,
                showAttachments: false,
                syncSelection: true,
                zoomToSelection: true,
                showGridMenu: false,
                editable: false,
                showColumnHeaderTooltips: false,
                showCyclicalRelationships: false,
                showFeatureCount: false,
                showStatistics: false,
                outFields: ["*"],


                fieldInfos: [
                     {
                         name: 'FID',
                         visible: false,
                     },
                       {
                           name: 'ID',
                           alias: '项目ID',
                       },
                  {
                      name: 'NAME',
                      alias: '项目名称',
                  },
                 {
                     name: 'XZQDM',
                     alias: '行政区代码',
                 },
                   {
                       name: 'ZRR',
                       alias: '责任人（单位）',
                   },
                     {
                         name: 'WZ',
                         alias: '用地位置',
                     },
                       {
                           name: 'TDXZ',
                           alias: '土地权属性质',
                       },
                         {
                             name: 'SSNYDLX',
                             alias: '设施农用地类型',
                         },
                           {
                               name: 'SSNYDGM',
                               alias: '设施农用地规模',
                           },
                             {
                                 name: 'ZYGDMJ',
                                 alias: '占用耕地面积',
                             },
                               {
                                   name: 'ZXZB',
                                   alias: '界址点坐标中心位置',
                                   visible: false,
                               },
                                 {
                                     name: 'JD',
                                     alias: '中心经度',
                                     visible: false,
                                 },
                                   {
                                       name: 'WD',
                                       alias: '中心纬度',
                                       visible: false,
                                   },
                                     {
                                         name: 'YXQX',
                                         alias: '有效期限',
                                     },
                                       {
                                           name: 'BACL',
                                           alias: '备案材料',
                                           visible: false,
                                       },
                                         {
                                             name: 'BASJ',
                                             alias: '备案时间',
                                         },
                                           {
                                               name: 'BJ',
                                               alias: '备注',
                                           },
                                          
                ],
            }, domConstruct.create('div', { id: 'myTableNode' }, 'myTableNodeDiv'));


            myFeatureTable.startup();


            //点击表格后 获取所选 features
            myFeatureTable.on("row-select", function (evt) {
                myFeatureTable.getFeatureDataById(myFeatureTable.selectedRowIds).then(function (res) {             
                    displayBYfeature(res.features[0],"BAXM")
                   
                });

            });






        }
      );
}   

function displayBAXMlayer(where)     //展示备案项目 动态图层
{

    if (g_main._mapControl._map.getLayer("BAXMlayer") != null) {
        g_main._mapControl._map.removeLayer(g_main._mapControl._map.getLayer("BAXMlayer"));

    }

    var BAXMlayer;

    require([
    "esri/layers/ArcGISDynamicMapServiceLayer", "esri/renderers/UniqueValueRenderer", "atide/gis/config/system-config",
    "esri/layers/DynamicLayerInfo", "esri/layers/LayerDataSource",
    "esri/layers/LayerDrawingOptions", "esri/layers/TableDataSource",
    "esri/Color", "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "dojo/dom", "dojo/dom-construct", "dojo/dom-style",
    "dojo/query", "dojo/on",
    "dojo/parser", "dojo/_base/array", "dojo/dnd/Source", "dijit/registry", "esri/symbols/SimpleMarkerSymbol",
    "dijit/form/Button", "dojo/domReady!"
    ], function (
       ArcGISDynamicMapServiceLayer, UniqueValueRenderer, SystemConfig,
       DynamicLayerInfo, LayerDataSource,
       LayerDrawingOptions, TableDataSource,
       Color, SimpleRenderer,
       SimpleFillSymbol, SimpleLineSymbol,
       dom, domConstruct, domStyle,
       query, on, parser, arrayUtils, Source, registry, SimpleMarkerSymbol
    ) {
       

        var dynamicLayerInfos;





        BAXMlayer = new ArcGISDynamicMapServiceLayer("http://220.165.247.91:6080/arcgis/rest/services/BAXM2/MapServer", {
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
        switchEvent("BAXM", where, dynamicLayerInfos);  //添加点击查询图层

      
    

        var defaultSymbol = SystemConfig.colorConfig.BAXMlayerColor;
        var renderer = new UniqueValueRenderer(defaultSymbol, "SSNYDLX");
        renderer.addValue("生产设施用地", SystemConfig.colorConfig.BAXMlayerColor);
        renderer.addValue("附属设施用地", SystemConfig.colorConfig.BAXMlayerColor2);
        renderer.addValue("配套设施用地", SystemConfig.colorConfig.BAXMlayerColor3);



        var drawingOptions = new LayerDrawingOptions();
        drawingOptions.renderer = renderer;

        //drawingOptions.renderer = new SimpleRenderer(SystemConfig.colorConfig.BAXMlayerColor);


        var options = [];
        options[0] = drawingOptions;
        BAXMlayer.setLayerDrawingOptions(options);

        var layerDefinitions = [];
        layerDefinitions[0] = where;
        BAXMlayer.setLayerDefinitions(layerDefinitions);







    });

}


function displayBYfeature(feature,kind)    //展示要素方法
{
    require([
  "esri/layers/ArcGISDynamicMapServiceLayer", "atide/gis/config/system-config","esri/InfoTemplate",
  "esri/layers/DynamicLayerInfo", "esri/layers/LayerDataSource",
  "esri/layers/LayerDrawingOptions", "esri/layers/TableDataSource",
  "esri/Color", "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
  "dojo/dom", "dojo/dom-construct", "dojo/dom-style",
  "dojo/query", "dojo/on",
  "dojo/parser", "dojo/_base/array", "dojo/dnd/Source", "dijit/registry", "esri/symbols/SimpleMarkerSymbol",
  "dijit/form/Button", "dojo/domReady!"
    ], function (
     ArcGISDynamicMapServiceLayer, SystemConfig,InfoTemplate,
     DynamicLayerInfo, LayerDataSource,
     LayerDrawingOptions, TableDataSource,
     Color, SimpleRenderer,
     SimpleFillSymbol, SimpleLineSymbol,
     dom, domConstruct, domStyle,
     query, on, parser, arrayUtils, Source, registry, SimpleMarkerSymbol
  ) {



        switch (kind) {
            case "BAXM":
                if (BAXMfeatureLayers.length > 0) {
                    delLayers(BAXMfeatureLayers);
                }
                var sms = SystemConfig.colorConfig.BAXMfeatureColor;
                var content = "要素代码: ${ID}<br/>" +
                   "项目名称: ${NAME}<br/>" +
                   "行政区代码: ${XZQDM}<br/>" +
                   "责任人（单位）: ${ZRR}<br/>" +
                   "用地位置: ${WZ}<br/>" +
                   "土地权属性质: ${TDXZ}<br/>" +
                   "设施农用地类型: ${SSNYDLX}<br/>" +
                   "设施农用地规模: ${SSNYDGM}<br/>" +
                   "占用耕地面积: ${ZYGDMJ}<br/>" +
                   "界址点坐标中心位置: ${ZXZB}<br/>" +
                   "中心经度: ${JD}<br/>" +
                   "中心纬度: ${WD}<br/>"+
                   "有效期限: ${YXQX}<br/>" +
                   "备案材料: ${BACL}<br/>" +
                   "备案时间: ${BASJ }<br/>" +
                   "备注: ${BJ}<br/>"

           
                var infoTemplate = new InfoTemplate("备案信息详细", content);
                displayFeature(BAXMfeatureLayers, g_main._mapControl._map, feature, sms, infoTemplate);
                break;

            case "TB":
                if (TBfeatureLayers.length > 0) {
                    delLayers(TBfeatureLayers);
                }
                var sms = SystemConfig.colorConfig.TBfeatureColor;
                var content = "要素代码: ${YSDM}<br/>" +
                  "标识码: ${BSM}<br/>" +
                  "行政区代码: ${XZQDM}<br/>" +
                  "项目名称: ${XMMC}<br/>" +
                  "变更前地类: ${BGQDL}<br/>" +
                  "变更后地类: ${BGHDL}<br/>" +
                  "变更范围: ${BGFW}<br/>" +
                  "监测变更面积: ${JCMJ}<br/>" +
                  "监测图斑编号: ${JCTBBH}<br/>" +
                  "土地变更描述: ${BGMS}<br/>" +
                  "监测年度: ${JCND}<br/>" +           
                    "备注: ${BZ}<br/>" +               
                    "附件查看:"
                var url = "http://220.165.247.91:6080/FJ_YGHC/" + feature.attributes.TIME + "/" + feature.attributes.XZQDM + "/B/" + feature.attributes.XZQDM + "_" + feature.attributes.JCTBBH + "_CL_1.jpg";
               
                if (isPictureEx(url)==1) {
                    content += "<a onclick='Img_show(\"" + feature.attributes.JCTBBH + "\"," + "\"" + feature.attributes.TIME + "\"," + "\"" + feature.attributes.XZQDM + "\")' id='Img_show'><img  src='/Content/MapSystem/images/images.png' /></a>"
                } else {
                    content += "<a onclick='Img_show()' id='Img_show'><img  src='/Content/MapSystem/images/images_h.png' /></a>"
                }
                var infoTemplate = new InfoTemplate("遥感核查详细信息", content);
                displayFeature(TBfeatureLayers, g_main._mapControl._map, feature, sms, infoTemplate);
                break;
        }

    });







    
}


//附件 弹出 页面
function Img_show(JCTBBH, TIME, XZQDM)
{
    if (JCTBBH == null)
    {
        alert("未找到相关附件")
    }
    else {
    
        layer.open({
            type: 2,
            title: '附件查看',
            maxmin: true,
            area: ['650px', '650px'],
            content: '/MapSystem/PictureView?JCTBBH=' + JCTBBH + '&TIME=' + TIME + '&XZQDM=' + XZQDM
        });
     
    }
}

function isPictureEx(url)   //检查是否有图片
{

    var img = document.createElement("img");
    img.src = url;
 
    if (img.complete == true) {  
        return 1;
    }
    else {     
        return 2;
    }
}




