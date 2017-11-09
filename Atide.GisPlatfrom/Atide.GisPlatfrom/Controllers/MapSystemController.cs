using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Atide.ReadTool;
using System.IO;
using Atide.GisPlatfrom.Models;

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


        #region 工具函数
        //json文件路径："~/Content/json/test.json"
        public ActionResult GetJsonFromFile(string path)
        {
            path = "~/App_Data/user.json";
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
        #endregion

    }
}