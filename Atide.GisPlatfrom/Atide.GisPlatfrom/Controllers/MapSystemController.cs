using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Atide.ReadTool;
using System.IO;
using Atide.GisPlatfrom.Models;
using Newtonsoft.Json;

namespace Atide.GisPlatfrom.Controllers
{
    public class MapSystemController : Controller
    {
        // GET: MapSystem
        public ActionResult Index()
        {
            if (Session["UserInfo"] != null)
            {
                var userEntity = (UserInfo)(Session["UserInfo"]);
                // login maintain
                ViewBag.UserName = userEntity == null ? string.Empty : userEntity.username;
                ViewBag.authority = userEntity == null ? string.Empty : userEntity.authority;

                return View();
            }
            else
            {
                return Redirect("/Account/Login");// RedirectToAction("Login");
            }
        }

        public ActionResult HeadView() {
            return PartialView("_HeadView");
        }

        public ActionResult MenuView()
        {
            return PartialView("_MenuView");
        }

        public ActionResult LeftTreeView()
        {
            return PartialView("_LeftTreeView");
        }

        public ActionResult ToolBarView()
        {
            return PartialView("_ToolBarView");
        }

        //时间轴视图
        public ActionResult TimelineView()
        {
            return PartialView("_TimelineView");
        }

        //底部结果视图
        public ActionResult BottomResultView()
        {
            return PartialView("_BottomResultView");
        }

        //查询统计视图
        public ActionResult StatisticsAnalysisView()
        {
            return PartialView("_StatisticsAnalysisView");
        }

        //附件图片查看视图
        public ActionResult PictureView(string JCTBBH,string TIME,string XZQDM)
        {
            ViewBag.JCTBBH = JCTBBH;
            ViewBag.TIME = TIME;
            ViewBag.XZQDM = XZQDM;
            return View("_PictureView");
        }
        //年份选择下拉视图
        public ActionResult YearSelectView()
        {
            return PartialView("_YearSelectView");
        }

        //用户管理视图
        public ActionResult UserView()
        {
            return PartialView("UserView");
        }

        //服务管理视图
        public ActionResult ServiceManageView(string type)
        {
            if (type == "1")
            {
                ViewBag.type = "服务新增";
            }
            else
            {
                ViewBag.type = "服务编辑";
            }

            return View("ServiceManageView");
        }

        #region 工具函数
        //json文件路径："~/Content/json/test.json"
        public ActionResult GetJsonFromFile(string name)
        {
            string path = "~/App_Data/";
            if (string.IsNullOrEmpty(name))
            {
                name = "user.json";
            }
            path += name;
            try
            {
                string filepath = Server.MapPath(path);
                string json = TextFileOper.GetFileJson(filepath);
                return Content(json);
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }
        //
        public ActionResult SaveJsonToFile(string path, string content)
        {
            if (string.IsNullOrEmpty(path))
            {
                path = "~/App_Data/user.json";
            }

            string fp = Server.MapPath(path);
            if (!System.IO.File.Exists(fp))  // 判断是否已有相同文件 
            {
                FileStream fs1 = new FileStream(fp, FileMode.Create, FileAccess.ReadWrite);

                fs1.Close();
            }
            System.IO.File.WriteAllText(fp, content);
            return Content("success");
        }
        public ActionResult SaveServiceToJson(string path, string content)
        {
            if (string.IsNullOrEmpty(path))
            {
                path = "~/App_Data/service.json";
            }
            //ServiceInfos lstUser = JsonConvert.DeserializeObject<ServiceInfos>(content);



            string fp = Server.MapPath(path);
            if (!System.IO.File.Exists(fp))  // 判断是否已有相同文件 
            {
                FileStream fs1 = new FileStream(fp, FileMode.Create, FileAccess.ReadWrite);

                fs1.Close();
            }
            System.IO.File.WriteAllText(fp, content);//JsonConvert.SerializeObject(lstUser)
            return Content("success");
        }
        #endregion

    }
}