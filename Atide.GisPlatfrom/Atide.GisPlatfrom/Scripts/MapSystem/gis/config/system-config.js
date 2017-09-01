/**
 * Created by 刘佳佳 on 2017/04/24
 * 系统相关配置
 */
define(["dojo/_base/declare"], function (declare) {
    var servicesHost = "172.17.204.200:6080";   //200 GIS服务器地址
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
            //几何服务地址
            geometryService: "http://" + servicesHost + "/arcgis/rest/services/Utilities/Geometry/GeometryServer",//http://172.17.204.200:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer
            //打印服务地址
            printService: "http://" + servicesHost + "/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        },
        
    }

})