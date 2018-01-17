﻿

var myFeatureLayers;   //分年featureLayers
var DT; //属性表
var featuresList = new Array() //存放所选图层全部要素
var lastYears = new Array(); //存放上次点击所选的年份数组
//展示图斑
function displayTB(code,selectTime)   //点击树  展示图斑和属性表
{
    if (code == null) {
        alert("请选择行政区");
        return;
    }
    if (selectTime[0]=="null")
    {
        alert("请选择年份");
        return;
    }

  // showHideYghcTable(1);              

    if (lastYears.length != 0) {                   //根据上次所选年份清除图层 和事件
        for (var i = 0; i < lastYears.length; i++) {
            g_main._mapControl._map.removeLayer(g_main._mapControl._map.getLayer("TBlayer" + lastYears[i]));
            _objEventTB["indentifyEventTB" + lastYears[i]].remove()
        }
    }
 
    lastYears = selectTime;   //本次所选年份记录

    var where = "XZQDM like '" + code + "%'";  //根据行政区生成 查询条件


    getselectFeatures(where, selectTime)  //展示图斑表

    for (var i = 0; i < lastYears.length; i++) {    //循环开启所选年份图斑
        displayTBlayer(where, lastYears[i]);//展示图斑 动态图层
    }
  
   
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


function getselectFeatures(where, selectTime)
{
    myFeatureLayers = {  //重置要素图层
        TB2014: null,
        TB2015: null,
        TB2016: null,
        TB2017: null,
        TB2018: null
    };
    featuresList = new Array();    //重置要素列表
    var yearsNum = 0;
    for (var i = 0; i < selectTime.length; i++)    //循环年份 获取要素属性
    {     
            getTBtable(where, selectTime[i])        
       
    }
    
    function getTBtable(where, year) {   //按条件获取 属性表
        require(["atide/gis/config/system-config", "esri/layers/FeatureLayer", "esri/tasks/query", "esri/layers/TableDataSource",
            "esri/layers/LayerDataSource", "dojo/domReady!"],
            function (SystemConfig, FeatureLayer, Query, TableDataSource, LayerDataSource) {



                var dataSource = new TableDataSource();
                dataSource.workspaceId = "TB";
                dataSource.dataSourceName = "YGHC-" + year + ".shp";
                var layerSource = new LayerDataSource();
                layerSource.dataSource = dataSource;
                var query = new Query();
                query.where = "1=1";
                query.outFields = ["*"];
                var Flayer = new FeatureLayer(SystemConfig.urlConfig.tbServiceUrl + "/dynamicLayer", {
                    id: "TBtable",
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"],
                    source: layerSource,

                });
                Flayer.setDefinitionExpression(where);

                myFeatureLayers["TB" + year] = Flayer;

                Flayer.queryFeatures(query, function (featureSet) {
                    yearsNum++;//返回结果+1
                    var features = featureSet.features;
                    for (var i = 0; i < features.length; i++) {
                        features[i].attributes.YEAR = year;

                    }

                    featuresList = featuresList.concat(features);

                    if (yearsNum == selectTime.length)      //最后一年数据载入完成，展示属性表
                    {
                        displayTable();
                    }

                });





            }
        );
    }
}




function displayTable()      //展示地图显示图斑的属性table
{
    var DTdate = new Array();
    for (var i = 0; i < featuresList.length; i++)
    {
        var obj = featuresList[i].attributes;
        var cache = new Array();

        for (var key in obj) {
            cache.push(obj[key])
        }
        cache.shift();
        DTdate.push(cache);
    }


    $(document).ready(function () {  
        if (DT != null)  //已经加载过属性表，销毁
        {
            DT.destroy();        
        }
       
        DT = $('#DTable').DataTable({    //生成属性表
            "data": DTdate,
            "columns": [
                { "title": "行政区代码" },
                { "title": "图斑编号" },
                { "title": "备注" },
                { "title": "现状核查" },
                { "title": "要素编码" },
                { "title": "项目名称" },
                { "title": "责任人" },
                { "title": "用地位置" },
                { "title": "用地类型" },
                { "title": "备案编号" },
                { "title": "备案时间" },
                { "title": "实际面积" },
                { "title": "核查结果" },
                { "title": "用地面积" },
                { "title": "占用耕地" },
                { "title": "用地规模" },
                { "title": "图斑年份" }
            ]
        });

      

         $("#DTable").on("click","tr",function(){//给tr或者td添加click事件
             var row = $(this)[0]._DT_RowIndex;
         
             if (row != null)
             {
                 for (var i = 0; i < featuresList.length; i++)
                 {
                     if (featuresList[i].attributes.TBBH == DTdate[row][1])
                     {
                         var selectFeature = featuresList[i];
                         displayBYfeature(selectFeature, "TB")                        
                         break;
                     }
                 }
               
             }
            
        })



    });
}



function displayTBlayer(where,year) {      //展示图斑层   
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

        var TBlayer;
        var dynamicLayerInfos;

        TBlayer = new ArcGISDynamicMapServiceLayer(SystemConfig.urlConfig.tbServiceUrl, {
            "id": "TBlayer" + year
        });


        g_main._mapControl._map.addLayer(TBlayer);

        dynamicLayerInfos = TBlayer.createDynamicLayerInfosFromLayerInfos();
   

    
        var layerName = "YGHC-"+year+".shp";              //shp名称

        var dynamicLayerInfo = new DynamicLayerInfo();
        dynamicLayerInfo.id = dynamicLayerInfos.length;
        dynamicLayerInfo.name = layerName;

        var dataSource = new TableDataSource();
        dataSource.workspaceId = "TB"; // 工作空间名称
        dataSource.dataSourceName = layerName;
       
        var layerSource = new LayerDataSource();
        layerSource.dataSource = dataSource;
        dynamicLayerInfo.source = layerSource;
        dynamicLayerInfos.push(dynamicLayerInfo);


        TBlayer.setDynamicLayerInfos(dynamicLayerInfos, true);


        switchEventTB(where, dynamicLayerInfos,year);  //添加点击查询图层


        var defaultSymbol = SystemConfig.colorConfig.TBlayerColor;       //根据用地类型渲染
        var renderer = new UniqueValueRenderer(defaultSymbol, "YDLX");
        renderer.addValue("生产设施用地", SystemConfig.colorConfig.TBlayerColor2);
        renderer.addValue("附属设施用地", SystemConfig.colorConfig.TBlayerColor3);
        renderer.addValue("配套设施用地", SystemConfig.colorConfig.TBlayerColor4);

        var drawingOptions = new LayerDrawingOptions();
        drawingOptions.renderer = renderer;

        var options = [];
        options[0] = drawingOptions;
        TBlayer.setLayerDrawingOptions(options);

        var layerDefinitions = []; //添加条件信息
        layerDefinitions[0] =where;
        TBlayer.setLayerDefinitions(layerDefinitions);

    });

}

function displayBAXMtable(where) {
    
    require(["atide/gis/config/system-config", "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/layers/TableDataSource",
          "esri/layers/LayerDataSource", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer","esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/Color", "esri/dijit/FeatureTable", "dojo/dom-construct","esri/layers/DynamicLayerInfo","esri/layers/TableDataSource","esri/layers/LayerDataSource", "esri/layers/LayerDrawingOptions","dojo/domReady!"],
        function (SystemConfig, FeatureLayer, InfoTemplate, TableDataSource, LayerDataSource, SimpleFillSymbol, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, Color, FeatureTable, domConstruct, DynamicLayerInfo, TableDataSource, LayerDataSource, LayerDrawingOptions) {
           
     
            var dataSource = new TableDataSource();
            dataSource.workspaceId = "BAXM";
            dataSource.dataSourceName = "BAXY.shp";
            var layerSource = new LayerDataSource();
            layerSource.dataSource = dataSource;

            
            var Flayer = new FeatureLayer(SystemConfig.urlConfig.baxmServiceUrl + "/dynamicLayer", {
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





        BAXMlayer = new ArcGISDynamicMapServiceLayer(SystemConfig.urlConfig.baxmServiceUrl, {
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
                var content = "要素编码: ${YSBM}<br/>" +
                   "图斑编号: ${TBBH}<br/>" +
                   "项目名称: ${XMMC}<br/>" +
                   "行政区代码: ${XZQDM}<br/>" +
                   "责任人: ${ZRR}<br/>" +
                   "用地位置: ${YDWZ}<br/>" +
                   "用地面积: ${YDMJ}<br/>" +
                   "占用耕地: ${GDMJ}<br/>" +
                   "设施农用地类型: ${YDLX}<br/>" +
                   "设施农用地规模: ${YDGM}<br/>" +
                   "实际监测面积: ${SJMJ}<br/>" +
                   "备案编号: ${BABH}<br/>"+
                   "现状核查: ${XZHC}<br/>" +
                   "核查结果: ${HCJG}<br/>" +
                   "备案时间: ${BASJ }<br/>" +
                   "备注: ${BZ}<br/>"

           
                var infoTemplate = new InfoTemplate("备案信息详细", content);
                displayFeature(BAXMfeatureLayers, g_main._mapControl._map, feature, sms, infoTemplate);
                break;

            case "TB":
                if (TBfeatureLayers.length > 0) {
                    delLayers(TBfeatureLayers);
                }
                var sms = SystemConfig.colorConfig.TBfeatureColor;
                var content = "要素编码: ${YSBM}<br/>" +
                    "图斑编号: ${TBBH}<br/>" +
                    "项目名称: ${XMMC}<br/>" +
                    "行政区代码: ${XZQDM}<br/>" +
                    "责任人: ${ZRR}<br/>" +
                    "用地位置: ${YDWZ}<br/>" +
                    "用地面积: ${YDMJ}<br/>" +
                    "占用耕地: ${GDMJ}<br/>" +
                    "设施农用地类型: ${YDLX}<br/>" +
                    "设施农用地规模: ${YDGM}<br/>" +
                    "实际监测面积: ${SJMJ}<br/>" +
                    "备案编号: ${BABH}<br/>" +
                    "现状核查: ${XZHC}<br/>" +
                    "核查结果: ${HCJG}<br/>" +
                    "备案时间: ${BASJ}<br/>" +
                    "备注: ${BZ}<br/>"+         
                    "附件查看:"
                var url = SystemConfig.fjConfig.yghcPictureUrl + feature.attributes.TIME + "/" + feature.attributes.XZQDM + "/B/" + feature.attributes.XZQDM + "_" + feature.attributes.JCTBBH + "_CL_1.jpg";
               
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
        layer.msg("未找到相关附件");
        //alert("未找到相关附件")
    }
    else {
    
        layer.open({
            type: 2,
            title: '附件查看',
            //maxmin: true,
            area: ['500px', '550px'],
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




