using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
                ViewBag.UserName = userEntity == null ? string.Empty : userEntity.USERNAME;

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

        public ActionResult TimelineView()
        {
            return PartialView("_TimelineView");
        }

        public ActionResult BottomResultView()
        {
            return PartialView("_BottomResultView");
        }

   


    }
}