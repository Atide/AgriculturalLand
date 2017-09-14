using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Atide.GisPlatfrom.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Account/Login

        /// <summary>
        /// 显示登录页面
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }


        /// <summary>
        /// 登录系统校验
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public JsonResult LoginIntoMain()
        {
            string RegName = string.Empty;
            if (Request.Params["txtREGNAME"] != null && !string.IsNullOrEmpty(Request.Params["txtREGNAME"].ToString()))
            {
                RegName = HttpUtility.UrlDecode(Request.Params["txtREGNAME"].ToString().Trim());
            }

            string PassWord = string.Empty;
            if (Request.Params["txtUserPwd"] != null && !string.IsNullOrEmpty(Request.Params["txtUserPwd"].ToString()))
            {
                PassWord = HttpUtility.UrlDecode(Request.Params["txtUserPwd"].ToString().Trim());
            }

            string strUrl = string.Empty;
            if (Request.Params["hidReturnUrl"] != null && !string.IsNullOrEmpty(Request.Params["hidReturnUrl"].ToString()))
            {
                strUrl = HttpUtility.UrlDecode(Request.Params["hidReturnUrl"].ToString().Trim());
            }
            UserInfo loginUserInfo = new UserInfo();
            loginUserInfo.USERID = "1";
            loginUserInfo.USERNAME = RegName;
            loginUserInfo.PASSWORD = PassWord;
            bool boolLogin = true;
            string strReturn = string.Empty;

            if (string.IsNullOrEmpty(RegName) || string.IsNullOrEmpty(PassWord))
            {
                boolLogin = false;
                strReturn = "用户名、密码不能为空！";
            }


            if (boolLogin)
            {
                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket
                    (Convert.ToInt32(loginUserInfo.USERID),
                        loginUserInfo.USERNAME,
                        DateTime.Now,
                        DateTime.Now.AddMinutes(20),
                        true,
                        loginUserInfo.USERID,
                        "/"
                    );

                var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));
                cookie.HttpOnly = true;
                HttpContext.Response.Cookies.Add(cookie);

                Session["UserInfo"] = loginUserInfo;
                //WebClient.ActionBLL.DBSystemPrames.modelLoginUser = (T_SYSUSERINFOEntity)(Session["UserInfo"]);

                if (!string.IsNullOrEmpty(strUrl))
                {
                    strReturn = strUrl;
                }
                else
                {
                    strReturn = "/";
                }
            }

            return Json(new { boolResult = boolLogin, returnMsg = strReturn }, JsonRequestBehavior.AllowGet);
        }


    }

    public class UserInfo
    {

        public string TableName { get; set; }
        public string USERID { get; set; }
        public string REGNAME { get; set; }
        public string USERNAME { get; set; }
        public string PASSWORD { get; set; }
        public string UNITID { get; set; }
        public string TELPHONE { get; set; }
        public string ADDRESS { get; set; }
        public string ISSTOP { get; set; }
        public string REMARK { get; set; }
        public string ISADMIN { get; set; }
        public string ROLEINFO { get; set; }
    }
}