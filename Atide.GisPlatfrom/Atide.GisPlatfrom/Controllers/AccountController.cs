using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Atide.GisPlatfrom.Models;
using Atide.ReadTool;
using Newtonsoft.Json;

namespace Atide.GisPlatfrom.Controllers
{
    public class AccountController : Controller
    {

        UserInfo loginUserInfo = new UserInfo();//当前登陆用户信息

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

        #region 工具函数

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
            
            bool boolLogin = true;
            string strReturn = string.Empty;

            //if (string.IsNullOrEmpty(RegName) || string.IsNullOrEmpty(PassWord))
            //{
            //    boolLogin = false;
            //    strReturn = "用户名、密码不能为空！";
            //}
            if (!valideUserInfo(RegName, PassWord))
            {
                boolLogin = false;
                strReturn = "用户名或密码不正确！";
            }

            


            if (boolLogin)
            {
                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket
                    (Convert.ToInt32(loginUserInfo.userid),
                        loginUserInfo.logionname,
                        DateTime.Now,
                        DateTime.Now.AddMinutes(20),
                        true,
                        loginUserInfo.username,
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

        //验证用户信息
        public bool valideUserInfo(string logionname, string password)
        {
            string path = "~/App_Data/user.json";
            try
            {
                string filepath = Server.MapPath(path);
                string json = TextFileOper.GetFileJson(filepath);
                UserInfos lstUser = JsonConvert.DeserializeObject<UserInfos>(json);
                if (lstUser == null || lstUser.rows == null)
                {
                    return false;
                }
                for (int i = 0; i < lstUser.rows.Count; i++)
                {
                    UserInfo user = lstUser.rows[i];
                    if (user.logionname == logionname && user.password == password && user.state == "1")
                    {
                        loginUserInfo = user;
                        loginUserInfo.userid = i;
                        return true;
                    }
                }
                return false;

            }
            catch (Exception ex)
            {
                return false;
            }
        }
       
        #endregion


    }
}