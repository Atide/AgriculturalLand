using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Atide.GisPlatfrom.Models
{
    public class UserInfo
    {
        public int userid { get; set; }
        public string username { get; set; }
        public string logionname { get; set; }
        public string password { get; set; }
        public string company { get; set; }
        public string telephone { get; set; }
        public string email { get; set; }
        public string authority { get; set; }
        public string state { get; set; }
    }

    public class UserInfos
    {
        public string total { get; set; }
        public List<UserInfo> rows { get; set; }
    }

    //{"id":11,"pId":1,"name":"行政区划-1","serviceurl":"http://220.165.247.91:6080/arcgis/rest/services/XZQH/MapServer","visuallayers": "0"}
    public class ServiceInfo
    {
        public string id { get; set; }
        public string pId { get; set; }
        public string name { get; set; }
        public string serviceurl { get; set; }
        public string visuallayers { get; set; }
    }

    public class ServiceInfos
    {
        public string id { get; set; }
        public string pId { get; set; }
        public string name { get; set; }
        public string open { get; set; }
        public string nocheck { get; set; }
        public List<ServiceInfo> children { get; set; }
    }
}