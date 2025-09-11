using CaffeeCoochMenu.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CaffeeCoochMenu.Web.Areas.AdminDashboard.Controllers
{
    [Area("AdminDashboard")]
    [Route("AdminDashboard")]
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

        [HttpGet]
        public async Task<IActionResult> Index(string filter = "all")
        {
            var products = await _productService.GetAllProductsAsync(filter: filter);
            return View(products);
        }

        [HttpGet("Product/{filter?}")]
        public async Task<IActionResult> ProductIndex(string filter = "all")
        {
            var products = await _productService.GetAllProductsAsync(filter: filter);
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
