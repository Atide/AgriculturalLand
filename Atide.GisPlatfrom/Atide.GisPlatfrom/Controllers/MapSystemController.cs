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
            return View();
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