using CaffeeCoochMenu.Application.DTOs;
using CaffeeCoochMenu.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CaffeeCoochMenu.Web.Areas.AdminDashboard.Controllers
{
    [Area("AdminDashboard")]
    [Route("AdminDashboard")]
    [Authorize(Roles = "SuperAdmin")]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("AddCategory")]
        public IActionResult AddCategory()
        {
            return View();
        }

        [HttpPost("AddCategory")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddCategory(AddCategoryViewModel model)
        {
            await _categoryService.AddCategory(model.CategoryName);
            return RedirectToAction("CategoryIndex", "Dashboard");
        }

        [HttpGet("DeleteCategory")]
        public IActionResult DeleteCategory()
        {
            return View();
        }

        [HttpPost("DeleteCategory")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategory(id);

            if(result)
            {
                TempData["SuccessMessage"] = "دسته بندی با موفقیت حذف شد";
                return RedirectToAction("CategoryIndex", "Dashboard");
            }

            TempData["ErrorMessage"] = "خطا در حذف دسته بندی، لطفا بعدا دوباره تلاش فرمایید";
            return RedirectToAction("CategoryIndex", "Dashboard");
        }
    }
}
