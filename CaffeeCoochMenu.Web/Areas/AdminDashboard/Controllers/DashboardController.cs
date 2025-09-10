using CaffeeCoochMenu.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CaffeeCoochMenu.Web.Areas.AdminDashboard.Controllers
{
    [Area("AdminDashboard")]
    [Authorize(Roles = "SuperAdmin")]
    public class DashboardController : Controller
    {
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        public DashboardController(IProductService productService, 
            ICategoryService categoryService)
        {
            _productService = productService;
            _categoryService = categoryService;
        }

        public async Task<IActionResult> Index()
        {
            var products = await _productService.GetAllProductsAsync();
            return View(products);
        }

        [HttpGet("Product")]
        public async Task<IActionResult> ProductIndex()
        {
            var products = await _productService.GetAllProductsAsync();
            return View(products);
        }

        [HttpGet("Category")]
        public async Task<IActionResult> CategoryIndex()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return View(categories);
        }
    }
}
