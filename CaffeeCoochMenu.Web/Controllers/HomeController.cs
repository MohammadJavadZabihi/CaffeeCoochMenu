using Microsoft.AspNetCore.Mvc;

namespace CaffeeCoochMenu.Web.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("Login")]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost("Login")]
        public IActionResult Login(string name)
        {
            return View();
        }
    }
}
