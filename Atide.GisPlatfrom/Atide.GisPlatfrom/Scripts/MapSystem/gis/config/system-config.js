﻿/**
 * Created by 刘佳佳 on 2017/04/24
 * 系统相关配置
 */
define(["dojo/_base/declare", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"], function (declare, SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol, Color) {
    var gisServersHost = "172.16.1.141";   //公司外网GIS服务器映射地址：220.165.247.91  公司内网：172.16.1.143 GIS服务器：172.16.1.141
    var gisServersPort = "6080"
    var webServerHost = "172.16.1.141";
    return {
        baseMapConfig: {//地图底图配置
            mapChangeKeepExtent: true,//地图切换后是否保留原有位置
            mapsNum: 2,
            maps: [
                {
                    id:'basemap_electronic',
                    mapUrl: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                    label: "云南电子地图",
                    image: "/Content/MapsDisplaySys/Images/BaseMap/electricBase.png",
                    initExtent: {
                        wkid: "4326",
                        xmin: 93.97237224580051,
                        ymin: 20.694045400965813,
                        xmax: 109.57257985825726,
                        ymax: 29.661197705674677
                    }
                },
                {
                    id: 'basemap_image',
                    mapUrl: "http://" + gisServersHost+":"+gisServersPort + "/arcgis/rest/services/ynRaster/ImageServer",//http://172.17.204.200:6080/arcgis/rest/services/ynRaster/ImageServer
                    label: "云南影像地图",
                    image: "/Content/MapsDisplaySys/Images/BaseMap/imageBase.png",
                }
            ]
        },
        urlConfig: {//地图服务配置
            //几何服务地址 http://172.17.204.200:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer
            geometryService: "http://" + gisServersHost+":"+gisServersPort + "/arcgis/rest/services/Utilities/Geometry/GeometryServer",
            //打印服务地址
            printService: "http://" + gisServersHost+":"+gisServersPort + "/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
            //行政区服务地址
            xzqQueryUrl: "http://" + gisServersHost+":"+gisServersPort + "/arcgis/rest/services/XZQH/MapServer/0",

            //地类图斑服务地址
            //外网地址 "http://220.165.247.91:6080/arcgis/rest/services/TB/MapServer"
            tbServiceUrl: "http://" + gisServersHost+":"+gisServersPort + "/arcgis/rest/services/TB/MapServer",

            //备案信息服务地址
            //内网网址 http://172.16.1.141:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer 
            //外网地址 http://220.165.247.91:6080/arcgis/rest/services/BAXM/MapServer/dynamicLayer
            baxmServiceUrl: "http://" + gisServersHost+":"+gisServersPort + "/arcgis/rest/services/BAXM2/MapServer"
        },
        fjConfig:{
            //遥感核查图片虚拟目录地址 内网地址：http://172.16.1.141:8091/FJ_YGHC/ 本地地址：http://127.0.0.1/FJ_YGHC/
            yghcPictureUrl: "http://" + webServerHost+"/FJ_YGHC/",
            //遥感核查附件服务器本地路径，用于判断图片是否存在
            yghcLocalDir: "D:\\工作\\云南省国土资源厅项目\\2017年项目-云南省设施农用地备案监管系统平台建设\\数据服务\\YGHC\\FJ",
            //导出excel存放本地路径
            yghcSaveDir: "C:\\NYSSTemp",
            //导出excelweb下载地址
            yghcSaveDirWebUrl: "http://" + webServerHost+ "/YGHCTemp/"
        },
        excelConfig: {
            fieldName:["序号", "县（区）", "项目名称", "用地总面积", "占用耕地面积", "生产设施用地", "附属设施用地", "配套设施用地", "其他类型", "备案文号", "备案时间", "备注"],
            sheetIndex: 1,
            rangeTop: 4,
            rangeBottom:3
        },

        colorConfig: {
        
          BAXMfeatureColor:  new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 15,           //备案项目 单选高亮情况
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([100, 100, 100]), 6),
                         new Color([13, 203, 242, 0])).setStyle(SimpleMarkerSymbol.STYLE_CIRCLE),
//图斑颜色
          TBfeatureColor: new SimpleFillSymbol("solid", null, new Color([113, 169, 254, 1])), //图斑 单选高亮情况

          TBlayerColor: new SimpleFillSymbol("solid", null, new Color([111, 111, 111, 1])),   //分类为空  全部显示情况
          TBlayerColor2: new SimpleFillSymbol("solid", null, new Color([0, 0, 255, 1])),   //生产设施用地 全部显示情况
          TBlayerColor3: new SimpleFillSymbol("solid", null, new Color([0, 255, 0, 1])),   //附属设施用地 全部显示情况
          TBlayerColor4: new SimpleFillSymbol("solid", null, new Color([255, 0, 0, 1])),   //配套设施用地 全部显示情况

          BAXMlayerColor:  new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 15,                        //备案项目 全部显示  生成设施
new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
new Color([113, 169, 254, 0.5]), 5),new Color([13, 203, 242])).setStyle(SimpleMarkerSymbol.STYLE_CIRCLE),

          BAXMlayerColor2: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 15,       //备案项目 全部显示  附属设施
new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
new Color([255, 215, 0]), 1), new Color([255, 215, 0])).setStyle(SimpleMarkerSymbol.STYLE_CIRCLE),

          BAXMlayerColor3: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 15,       //备案项目 全部显示  配套设施
new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
new Color([255, 108, 96]), 1), new Color([255, 108, 96])).setStyle(SimpleMarkerSymbol.STYLE_CIRCLE),



        },


        selectConfig: {              //属性下拉列表选项
            querySelect: [                     //查询字段配置
                { field: 'XZQDM', title: '行政区代码'},
                { field: 'TBBH', title: '图斑编号'},              
                { field: 'XZHC', title: '现状核查'},
                { field: 'YSBM', title: '要素编码' },
                { field: 'XMMC', title: '项目名称' },
                { field: 'ZRR', title: '责任人'},
                { field: 'YDWZ', title: '用地位置' },
                { field: 'YDLX', title: '用地类型'},
                { field: 'BABH', title: '备案编号'},
                { field: 'BASJ', title: '备案时间'},               
                { field: 'HCJG', title: '核查结果'},
             
              
               
               
            ],
            staSelect: [       //统计字段配置
                { field: 'XZQDM', title: '行政区代码' },                                         
                { field: 'ZRR', title: '责任人' },               
                { field: 'YDLX', title: '用地类型' },
                { field: 'BABH', title: '备案编号' },
                { field: 'BASJ', title: '备案时间' },
                { field: 'HCJG', title: '核查结果' },]
        }
        
    }

})