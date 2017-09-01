/**
 * Created by 刘佳佳 on 2017/04/24
 * xml读取操作类
 */
define(["dojo/_base/declare", "dojox/data/XmlStore", "dojo/_base/lang"], function (declare, XmlStore, lang) {
    return declare(null, {
        _store: null,   //xml数据内容存储

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param>param:传入参数，必须包含：{ path: '文件路径', root:'查询节点名'}</param>
        /// <returns></returns>
        constructor: function (param) {
            this.initXml(param.path, param.root);
        },

        initXml: function (path, root) {
            this._store = new XmlStore({ url: path, rootItem: root });
        },

        /// <summary>
        /// 根据条件进行查找
        /// </summary>
        /// <param>queryObj:查询条件，比如：{ "isbn": 6 }</param>
        /// <param>func:设置数据获取完成后的回调函数</param>
        /// <returns></returns>
        search: function (queryObj, func) {
            this._store.fetch({ query: queryObj, onComplete: func, onError: this.fetchFailed });
        },

        // 回调函数编写示例如下
        gotItems: function (items, request) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                console.log("Located book: " + this._store.getValue(item, "attrname"));
            }
        },

       // 设置数据获取失败后的回调函数
        fetchFailed: function (error, request) {
            alert("lookup failed.");
            alert(error);
        }
    });

});


/*此工具调用方式如下：
require(["MapsDisplaySys/xml-config"],
    function (xmlConfig) {
        var config = new xmlConfig({ path: baseUrl + "Content/ConfigureFile/MapsDisplaySys/Menu.xml", root: "book" });
        config.search({ "isbn": 6 }, function (items, request) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                console.log("Located book: " + config._store.getValue(item, "title"));
            }
        });
    });
*/