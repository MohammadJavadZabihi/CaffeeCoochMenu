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
        private readonly IWebHostEnvironment _env;
        private readonly IValidationImageUploadService _validationImageUploadService;
        public CategoryController(ICategoryService categoryService,
            IWebHostEnvironment webHostEnvironment,
            IValidationImageUploadService validationImageUpload)
        {
            _env = webHostEnvironment;
            _validationImageUploadService = validationImageUpload;
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
            string imageUrl = string.Empty;

            if (model.Image != null && model.Image.Length > 0
                && _validationImageUploadService.IsExtentionValid(model.Image)
                && _validationImageUploadService.IsMimeTypeValid(model.Image))
            {
                var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                var uploadFolder = Path.Combine(webRootPath, "UploadsCategory");
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(model.Image.FileName);
                var filePath = Path.Combine(uploadFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(fileStream);
                }

                imageUrl = "/UploadsCategory/" + uniqueFileName;
            }

            await _categoryService.AddCategory(model.CategoryName, imageUrl);
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
