/**
 * Created by 刘佳佳 on 2017/04/24
 * 地图控件操作类，包括地图初始化，加载工具栏
 */
define(["dojo/_base/declare", "dojo/_base/array", "esri/TimeExtent", "dojo/_base/connect", "dijit/registry", "esri/dijit/TimeSlider", "dojo/dom", "dojo/_base/lang", "atide/gis/config/system-config", "atide/gis/tdt/TDTSLLayer", "atide/gis/tdt/TDTSLAnnoLayer", "atide/gis/tdt/TDTYXLayer", "atide/gis/tdt/TDTYXAnnoLayer"],
    function (declare, arrayUtils, TimeExtent, connect, registry, TimeSlider, dom, lang, SystemConfig, TDTSLLayer, TDTSLAnnoLayer, TDTYXLayer, TDTYXAnnoLayer) {
        return declare(null, {
            _map: null,             //地图
            _toolbar: null,         //地图工具栏
            _timeSlider: null,
            _basemapSl: null,
            _annolayerSl: null,
            _basemapYx: null,
            _annolayerYx: null,
            //构造函数
            constructor: function (param) {
                this.initMapControl(param.id);
                this.loadArcgisToolbar();
            },

            //初始化地图控件
            initMapControl: function (id) {
                var that = this;
                require(["dojo/topic", "esri/config", "esri/basemaps", "esri/dijit/BasemapLayer", "esri/dijit/BasemapGallery", "dojo/dom-construct", "esri/dijit/Basemap", "esri/map", "esri/dijit/Scalebar", "dojo/_base/lang", "dojo/on"],
                    function (topic, esriConfig, esriBasemaps, BasemapLayer, BasemapGallery, domConstruct, Basemap, Map, Scalebar, lang, on) {
                        for (var i = 0; i < SystemConfig.baseMapConfig.maps.length; i++) {
                            esriBasemaps[SystemConfig.baseMapConfig.maps[i].id] = {
                                baseMapLayers: [{ url: SystemConfig.baseMapConfig.maps[i].mapUrl }],
                                title: SystemConfig.baseMapConfig.maps[i].label
                            };
                        }
                        //esri.config.defaults.io.proxyUrl = "http://localhost/DotNet/proxy.ashx";
                        //esri.config.defaults.io.alwaysUseProxy = false;
                        //esriBasemaps.electronic = {
                        //    baseMapLayers: [{ url: SystemConfig.baseMapConfig.maps[0].mapUrl }],
                        //    //thumbnailUrl: baseUrl + "Images/BaseMap/electricBase.png",
                        //    title: "矢量地图"
                        //};
                        //esriBasemaps.image = {
                        //    baseMapLayers: [{ url: SystemConfig.baseMapConfig.maps[1].mapUrl }],
                        //    //thumbnailUrl: baseUrl + "Images/BaseMap/imageBase.png",
                        //    title: "影像地图"
                        //};
                        //var infoWindow = new InfoWindow({
                        //    domNode: domConstruct.create("div", null, dom.byId("ArcGISMapControl"))
                        //});

                        //var electronic = new BasemapLayer({
                        //    url: SystemConfig.baseMapConfig.maps[0].mapUrl
                        //});
                        //var image = new BasemapLayer({
                        //    url: SystemConfig.baseMapConfig.maps[1].mapUrl
                        //});
                        //var test = new BasemapLayer({
                        //    url: SystemConfig.baseMapConfig.maps[0].mapUrl
                        //});
                        //var Basemap1 = new Basemap({
                        //    layers: [electronic],
                        //    title: "矢量地图",
                        //    thumbnailUrl: baseUrl + "Content/Images/BaseMap/electricBase.png",
                        //});
                        //var Basemap2 = new Basemap(
                        //    {
                        //        layers: [image],
                        //        title: "影像地图",
                        //        thumbnailUrl: baseUrl + "Content/Images/BaseMap/imageBase.png",
                        //    });
                        //var Basemap3 = new Basemap( {
                        //        layers: [test],
                        //        title: "电子航道图",
                        //        thumbnailUrl: baseUrl + "Content/Images/BaseMap/electricBase.png",
                        //    });

                        var map = new Map(id, {
                            //basemap: SystemConfig.baseMapConfig.maps[0].id,
                            //basemap: "streets",
                            //center: [102.707, 25.042], // long, lat
                            //zoom: 2,
                            logo: false,
                            sliderStyle: "large",
                            //sliderStyle: "small",
                            sliderPosition: "top-left"
                            //infoWindow: infoWindow
                            //spatialReference: { wkid: 4326 }
                        });

                        that._basemapSl = new TDTSLLayer();
                        map.addLayer(that._basemapSl);
                        that._annolayerSl = new TDTSLAnnoLayer();
                        map.addLayer(that._annolayerSl);
                        map.centerAndZoom(new esri.geometry.Point(102.707, 25.042, new esri.SpatialReference({ wkid: 4326 })),5);

                        that._basemapYx = new TDTYXLayer();
                        map.addLayer(that._basemapYx);         
                        that._annolayerYx = new TDTYXAnnoLayer();
                        map.addLayer(that._annolayerYx);
                        that._basemapYx.hide();
                        that._annolayerYx.hide();

                        //比例尺
                        var scalebar = new Scalebar({
                            map: map,
                            attachTo: "bottom-left",
                            scalebarStyle: "line"
                        });

                        that._map = map;

                        //var basemapGallery = new BasemapGallery({
                        //    showArcGISBasemaps: false,
                        //    map: map
                        //}, "BasemapToggle");
                        //basemapGallery.add(Basemap1);
                        //basemapGallery.add(Basemap2);
                        //basemapGallery.add(Basemap3);
                        //basemapGallery.startup();

                        //var timeExtent = new TimeExtent();
                        //timeExtent.startTime = new Date("01/01/2014 UTC");
                        //timeExtent.endTime = new Date("01/01/2017 UTC");

                        //that._timeSlider = new TimeSlider({
                        //    style: "width: 100%;"
                        //}, dom.byId("myTimeline"));
                        ////that._map.setTimeSlider(timeSlider);
                        //that._timeSlider.setThumbCount(1);
                        //that._timeSlider.createTimeStopsByTimeInterval(timeExtent, 1, 'esriTimeUnitsYears');
                        //that._timeSlider.on("time-extent-change", that.displayTimeInfo);
                        //that._timeSlider.startup();
                        //var labels = arrayUtils.map(that._timeSlider.timeStops, function (timeStop, i) {
                        //        return timeStop.getUTCFullYear();        
                        //});
                        //that._timeSlider.setLabels(labels);
                       



                        on(that._map, "load", lang.hitch(that, function (obj) {
                            //g_Main._map = obj.map;
                            //obj.map.setBasemap("electronic");
                            //topic.publish("loadLeftMenuHtml", obj.map);
                            //var mapLoadedEventSubscribe = topic.subscribe("loadLeftMapService", lang.hitch(this, function (map) {
                            //    mapLoadedEventSubscribe.remove();
                            //}));
                            //that._centerPoint = obj.map.toMap(obj.map.position);
                            //alert("x:" + that._centerPoint.x + " y:" + that._centerPoint.y);

                        }));

                    });
            },
            setBaseMap: function (type) {
                if (type == 1) {
                    this._basemapSl.show();
                    this._annolayerSl.show();
                    this._basemapYx.hide();
                    this._annolayerYx.hide();
                }
                else {
                    this._basemapSl.hide();
                    this._annolayerSl.hide();
                    this._basemapYx.show();
                    this._annolayerYx.show();
                }
            },

            //初始化工具栏控件
            loadArcgisToolbar: function () {
                var that = this;
                var toolbar = dom.byId("tool-common");
                require(["atide/gis/arcgis-toolbars"], function (arcgisTools) {
                    ;
                    var comToo = new arcgisTools({ map: that._map });
                    comToo.placeAt(toolbar, "first");
                    comToo.startup();
                    comToo.show();
                    that._toolbar = comToo;
                });


            },

            displayTimeInfo: function (timeExtent) {
                var that = this;
                var info = timeExtent.startTime.getUTCFullYear() +
                    "   <i>to<\/i>   " +
                    timeExtent.endTime.getUTCFullYear();
                console.log(info);

                //var curlayer = that._map.getLayer("layer_" + timeExtent.endTime.getUTCFullYear());//
                //if (curlayer != null) {
                //    //if (timeExtent.endTime.getUTCFullYear() == 2014) {
                //    //    curlayer.setVisibleLayers([-1]);
                //    //}
                //    //else {
                //    //    curlayer.setVisibleLayers([-1]);
                //    //}
                //    that._map.removeLayer(curlayer);
                //}
                //else {

                //    var featureLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/ks_earthquakes_since_2000/FeatureServer/0", {
                //        mode: FeatureLayer.MODE_SNAPSHOT,
                //        outFields: ["*"],
                //        id: "layer_" + timeExtent.endTime.getUTCFullYear()
                //    });
                //    that._map.addLayer(featureLayer);
                //}

                
            }
            
    });
    });


