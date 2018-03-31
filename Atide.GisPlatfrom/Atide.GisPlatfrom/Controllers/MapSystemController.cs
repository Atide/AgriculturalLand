using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Atide.ReadTool;
using System.IO;
using Atide.GisPlatfrom.Models;
using Newtonsoft.Json;
using System.Data;
using Atide.GisPlatfrom.CommonTool;

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

        //属性表查看视图
        public ActionResult DTView()
        {
            return PartialView("_DTView");
        }
        //空间查询视图
        public ActionResult GeoQueView()
        {
            return PartialView("_GeoQueView");
        }
        //空间统计视图
        public ActionResult GeoStaView()
        {
            return PartialView("_GeoStaView");
        }
        //属性查询视图
        public ActionResult AttQueView()
        {
            return PartialView("_GeoQueView");
        }
        //属性统计视图
        public ActionResult AttStaView()
        {
            return PartialView("_AttStaView");
        }

        //用地规模监管查看视图
        public ActionResult YDGMJGView()
        {
            return PartialView("_YDGMJGView");
        }
        //备案材料监管查看视图
        public ActionResult BACLJGView()
        {
            return PartialView("_BACLJGView");
        }
        //变更调查查看视图
        public ActionResult BGDCJGView()
        {
            return PartialView("_BGDCJGView");
        }

        //附件图片查看视图
        public ActionResult PictureView(string TBBH,string TIME,string XZQDM)
        {
            ViewBag.TBBH = TBBH;
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

        //备案报表管理视图
        public ActionResult BeiAnInfoManageView()
        {
            return View("BeiAnInfoManageView");
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
                return Content("fail:" + ex.Message);
            }
        }
        //
        public ActionResult SaveJsonToFile(string path, string content)
        {
            if (string.IsNullOrEmpty(path))
            {
                path = "~/App_Data/" + "user.json";
            }
            else
            {
                path = "~/App_Data/" + path;
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

        /// <summary>
        /// 导出Excel
        /// </summary>
        /// <returns></returns>
        public ActionResult ExportExcel()
        {
            string json = Request.Params["data"];
            try
            {
                DataTable dt = ExcelHelper.JsonToDataTable(json);
                string pathDestop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                ExcelHelper.GridToExcelByNPOI(dt, pathDestop + "\\" + Request.Params["filename"] + "数据导出-" + DateTime.Now.ToString("yyyy-MM-dd") + ".xls");
                return Content("1");
            }
            catch (Exception)
            {
                return Content("-1");
            }
        }

        public ActionResult isFileExsit()
        {
            string path =  Request.Params["path"];
            if (string.IsNullOrEmpty(path))
            {
                return Content("fail");
            }

            if (System.IO.File.Exists(path))  // 判断是否已有相同文件 
            {
                return Content("success");
            }
            return Content("fail");
        }

        #endregion

    }
}