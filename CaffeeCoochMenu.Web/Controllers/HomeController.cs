using CaffeeCoochMenu.Application.DTOs;
using CaffeeCoochMenu.Core.Entities;
using CaffeeCoochMenu.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CaffeeCoochMenu.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public HomeController(IProductService productService,
            ICategoryService categoryService,
            SignInManager<ApplicationUser> signInManager)
        {
            _productService = productService;
            _categoryService = categoryService;
            _signInManager = signInManager;
        }

        [HttpGet("{category?}")]
        public async Task<IActionResult> Index(string category = "")
        {

            var prdoucts = await _productService.GetAllProductsAsync(category: category);
            var categories = await _categoryService.GetAllCategoriesAsync();

            var result = new IndexViewModel
            {
                Categories = categories,
                Products = prdoucts,
                CurrentCategory = string.IsNullOrEmpty(category) ? "" : category
            };
            ViewBag.CurrentCategory = string.IsNullOrEmpty(category) ? "" : category;
            return View(result);
        }

        [HttpGet("Login")]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost("Login")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel login)
        {
            var result = await _signInManager.PasswordSignInAsync(login.UserName,
                login.Password, true, false);
            if (result.Succeeded)
            {
                return RedirectToAction("Index");
            }

            ModelState.AddModelError("", "نام کاربری و یا رمز عبور اشتباه است");
            return View();
        }
    }
}
