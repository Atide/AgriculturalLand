/**
 * Created by 刘佳佳 on 2017/04、07
 * ArcGIS通用工具，放大、缩小、标注、测距、清空
 */
define([
    "dojo/_base/declare",
    "esri/dijit/Print",
    "esri/tasks/PrintTemplate",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-attr",
    "dojo/dom",
    "dojo/on",
    "dojo/aspect",
    "dojo/query",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/topic",
    "dojo/sniff",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/registry",
    "esri/toolbars/navigation",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/tasks/DistanceParameters",
    "esri/Color",
    "esri/InfoTemplate",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/SpatialReference",
    "esri/dijit/Measurement",
    "esri/config",
    "atide/gis/config/system-config",
    "dojo/text!./templates/arcgisToolsTemplate.html",
    "dojo/domReady!"
], function (declare, Print, PrintTemplate, PrintTask, PrintParameters, lang, array, domAttr, dom, on, aspect, query, domStyle, domConstruct, topic, sniff, _WidgetBase, _TemplatedMixin, registry, Navigation, Draw, Graphic, GraphicsLayer, esriPoint, GeometryService, ProjectParameters, DistanceParameters, Color, InfoTemplate, SimpleLineSymbol, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleFillSymbol,TextSymbol, Font, SpatialReference, Measurement, esriConfig, systemConfig, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        _map: null,
        drawToolbar: null,
        domNodeToPlace: null,
        geometryService: null,
        nav: false,
        isVisible: false,
        isMeasureLength: false,
        isDrawLayel: false,
        printTool: null,
        totalDistance: 0,
        inputPoints: [],
        legDistance: [],

        _navToolbar: null,
        _measurement: null,
        _drawTool: null,
        constructor: function (params) {
            this._map = params.map;
            esriConfig.defaults.geometryService = new esri.tasks.GeometryService(systemConfig.urlConfig.geometryService);
 
            this._navToolbar = new Navigation(params.map);
            on(this._navToolbar, "extent-history-change", lang.hitch(this, this.extentHistoryChangeHandler));

        },

        //postCreate: function () {
        //    this.inherited(arguments);
        //},

        //地图历史更新响应函数，以用于控制前一视图、后一视图状态
        extentHistoryChangeHandler: function () {

            if (this._navToolbar.isFirstExtent()) {
                $("#zoomPrev").addClass("disbale");
            }
            else {
                $("#zoomPrev").removeClass("disbale");
            }
            if (this._navToolbar.isLastExtent()) {
                $("#zoomNext").addClass("disbale");
            }
            else {
                $("#zoomNext").removeClass("disbale");
            }
        },


        //地图放大
        _zoomInMap: function () {
            ////设置鼠标图标
            //this.nav = true;
            var cursorUrl = "/Content/MapSystem/images/Cursors/zoomIn.cur";
            this._map.setMapCursor("url(" + cursorUrl + "),auto");
            //homeAppConfig.mapManager.onNavRequest(Navigation.ZOOM_IN, "放大");

            if (this._navToolbar == null) {
                var navToolbar = new Navigation(this._map);
                this._navToolbar = navToolbar;
            }
            this._navToolbar.activate(Navigation.ZOOM_IN);
            this.setToolbarStatus("ZoomIn");

        },

        //地图缩小
        _zoomOutMap: function () {
            var cursorUrl = "/Content/MapSystem/images/Cursors/zoomOut.cur";
            this._map.setMapCursor("url(" + cursorUrl + "),auto");

            if (this._navToolbar == null) {
                var navToolbar = new Navigation(this._map);
                this._navToolbar = navToolbar;
            }
            this._navToolbar.activate(Navigation.ZOOM_OUT);
            this.setToolbarStatus("ZoomOut");
        },

        //地图全图
        _zoomFullExtent: function () {
            //var cursorUrl = "/Content/MapSystem/images/Cursors/openhand.cur";
            //this._map.setMapCursor("url(" + cursorUrl + "),auto");
            this._map.setMapCursor("default");
            if (systemConfig.baseMapConfig.maps[0].initExtent) {
                var initExtent = systemConfig.baseMapConfig.maps[0].initExtent;
                var extent = new esri.geometry.Extent({
                    xmin: initExtent.xmin,
                    ymin: initExtent.ymin,
                    xmax: initExtent.xmax,
                    ymax: initExtent.ymax
                });
                this._map.setExtent(extent);
            }
            else {
                if (this._navToolbar == null) {
                    var navToolbar = new Navigation(this._map);
                    this._navToolbar = navToolbar;
                }
                this._navToolbar.zoomToFullExtent();
            }
        },

        //地图平移
        _zoomPan: function () {
            var cursorUrl = "/Content/MapSystem/images/Cursors/openhand.cur";
            this._map.setMapCursor("url(" + cursorUrl + "),auto");
            if (this._navToolbar == null) {
                var navToolbar = new Navigation(this._map);
                this._navToolbar = navToolbar;
            }
            this._navToolbar.activate(Navigation.PAN);
            this.setToolbarStatus("ZoomPan");
        },

        //上一视图
        _zoomPrev: function () {
            //var cursorUrl = "/Content/MapSystem/images/Cursors/openhand.cur";
            //this._map.setMapCursor("url(" + cursorUrl + "),auto");
            this._map.setMapCursor("default");
            if (this._navToolbar == null) {
                var navToolbar = new Navigation(this._map);
                this._navToolbar = navToolbar;
            }
            this._navToolbar.zoomToPrevExtent();
        },

        //下一视图
        _zoomNext: function () {
            //var cursorUrl = "/Content/MapSystem/images/Cursors/openhand.cur";
            this._map.setMapCursor("default");
            if (this._navToolbar == null) {
                var navToolbar = new Navigation(this._map);
                this._navToolbar = navToolbar;
            }
            this._navToolbar.zoomToNextExtent();
        },

        //设置工具栏是否当前选择状态
        setToolbarStatus: function (name) {
            $("#btnZoomPan").removeClass("emphasis");
            $("#btnZoomIn").removeClass("emphasis");
            $("#btnZoomOut").removeClass("emphasis");
            switch (name) {
                case "ZoomPan":
                    $("#btnZoomPan").addClass("emphasis");
                    break;
                case "ZoomIn":
                    $("#btnZoomIn").addClass("emphasis");
                    break;
                case "ZoomOut":
                    $("#btnZoomOut").addClass("emphasis");
                    break;
            }
        },

        //打印地图
        _print: function () {
            if (this._printer == null) {
                this._printer = new Print({ map: this._map, url: systemConfig.urlConfig.printService },
                    dom.byId("print"));
                this._printer.startup();
            }
            this._map.setMapCursor("default");
            var node = dom.byId("printDiv");
            if (domStyle.get(node, "display") == "block") {
                domStyle.set(node, "display", "none");
                this._printer.hide();
                $("#btnPrint").removeClass("emphasis");
            }
            else {
                domStyle.set(node, "display", "block");
                this._printer.show();
                $("#btnPrint").addClass("emphasis");

                this.setWidgetSatus("measurementDiv", "btnMeasure");
                this.setWidgetSatus("drawDiv", "btnDraw");
            }
        },

        //测量工具
        _measureMap: function () {
            if (this._measurement == null) {
                this._measurement = new Measurement({ map: this._map }, dom.byId("measurement"));
                this._measurement.startup();
            }          
            var node = dom.byId("measurementDiv");
            if (domStyle.get(node, "display") == "block") {
                this._map.setMapCursor("default");
                domStyle.set(node, "display", "none");
                this._measurement.hide();
                $("#btnMeasure").removeClass("emphasis");
                this._measurement.clearResult();
                this._measurement.setTool(this._measurement.getTool().toolName, false);
            }
            else {
                this.setWidgetSatus("printDiv", "btnPrint");
                this.setWidgetSatus("drawDiv", "btnDraw");

                var cursorUrl = "/Content/MapSystem/images/Cursors/measure.cur";
                this._map.setMapCursor("url(" + cursorUrl + "),auto");
                domStyle.set(node, "display", "block");
                domStyle.set(dom.byId("measurement"), "display", "block");
                this._measurement.show();
                $("#btnMeasure").addClass("emphasis");


            }
        },

        //地图标绘
        _draw: function () {
            if (this._drawTool == null) {
                this._drawTool = new Draw(this._map);
                this._drawTool.on("draw-end", lang.hitch(this, this.addToMap));
            }
            var node = dom.byId("drawDiv");
            if (domStyle.get(node, "display") == "block") {
                this._map.setMapCursor("default");
                domStyle.set(node, "display", "none");
                $("#btnDraw").removeClass("emphasis");
            }
            else {
                this.setWidgetSatus("printDiv", "btnPrint");
                this.setWidgetSatus("measurementDiv", "btnMeasure");

                this._map.setMapCursor("crosshair");
                domStyle.set(node, "display", "block");
                $("#btnDraw").addClass("emphasis");          
            }

        },
        //属性查看
        _veiwAttribute: function () {
            document.getElementById("DTFloatingPane").style.visibility = "visible";
        },

        setWidgetSatus: function (contain,button) {
            if (domStyle.get(dom.byId(contain), "display") == "block") {
                domStyle.set(dom.byId(contain), "display", "none");
                if (contain == "measurementDiv") {
                    this._measurement.hide();
                    this._measurement.clearResult();
                    if (this._measurement.getTool() != null)
                        this._measurement.setTool(this._measurement.getTool().toolName, false);
                }
                
                $("#" + button).removeClass("emphasis");
            }
        },

        activateTool: function (tool) {
            this._drawTool.activate(Draw[tool]);
            this._map.hideZoomSlider();
        },

        addToMap: function (evt) {
            var symbol;
            this._drawTool.deactivate();
            this._map.showZoomSlider();
            switch (evt.geometry.type) {
                case "point":
                case "multipoint":
                    symbol = new SimpleMarkerSymbol();
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol();
                    break;
                default:
                    symbol = new SimpleFillSymbol();
                    break;
            }
            var graphic = new Graphic(evt.geometry, symbol);
            this._map.graphics.add(graphic);
        },

        //地图清除
        _clearGraphics: function () {
            if (this._navToolbar) {
                this._navToolbar.activate(Navigation.PAN);
            }
            //this._map.setMapCursor("default");
            if (this._map) {
                array.forEach(this._map.graphicsLayerIds, lang.hitch(this, function (layerId) {
                    var graphicLayer = this._map.getLayer(layerId);
                    if (graphicLayer) {
                        graphicLayer.clear();
                    }
                }));
                this._map.graphics.clear();
            }
            this.setToolbarStatus("ZoomPan");
        },

        hide: function () {
            domStyle.set(this.domNode, "display", "none");
            this.isVisible = false;
        },

        show: function () {
            domStyle.set(this.domNode, "display", "block");
            this.isVisible = true;
        },

        startup: function () {
            this.inherited(arguments);
            this.isVisible = true;
            this.setToolbarStatus("ZoomPan");
        }
    });
});
