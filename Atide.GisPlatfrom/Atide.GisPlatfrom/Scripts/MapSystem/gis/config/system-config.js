/**
 * Created by 刘佳佳 on 2017/04/24
 * 系统相关配置
 */
define(["dojo/_base/declare", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"], function (declare, SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol, Color) {
    var servicesHost = "220.165.247.91:6080";   //公司外网GIS服务器映射地址：220.165.247.91  公司内网：172.16.1.143
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
                    mapUrl: "http://" + servicesHost + "/arcgis/rest/services/ynRaster/ImageServer",//http://172.17.204.200:6080/arcgis/rest/services/ynRaster/ImageServer
                    label: "云南影像地图",
                    image: "/Content/MapsDisplaySys/Images/BaseMap/imageBase.png",
                }
            ]
        },
        urlConfig: {//地图服务配置
            //几何服务地址 http://172.17.204.200:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer
            geometryService: "http://" + servicesHost + "/arcgis/rest/services/Utilities/Geometry/GeometryServer",
            //打印服务地址
            printService: "http://" + servicesHost + "/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        },

        colorConfig: {
        
          BAXMfeatureColor:  new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 15,           //备案项目 单选高亮情况
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([100, 100, 100]), 6),
                         new Color([13, 203, 242,0])).setStyle(SimpleMarkerSymbol.STYLE_CIRCLE),
          TBfeatureColor: new SimpleFillSymbol("solid", null, new Color([10, 255, 10, 0.85])), //图斑 单选高亮情况
 

          TBlayerColor: new SimpleFillSymbol("solid", null, new Color([0, 150, 255, 1])),   //图斑图层 全部显示情况

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

        
    }

})