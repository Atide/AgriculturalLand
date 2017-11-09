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
}