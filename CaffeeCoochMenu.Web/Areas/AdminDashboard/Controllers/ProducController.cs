using Azure.Core;
using CaffeeCoochMenu.Application.DTOs;
using CaffeeCoochMenu.Core.Entities;
using CaffeeCoochMenu.Core.Interfaces;
using CaffeeCoochMenu.Infrastracture.Persictense.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CaffeeCoochMenu.Web.Areas.AdminDashboard.Controllers
{
    [Area("AdminDashboard")]
    [Route("AdminDashboard")]
    [Authorize(Roles = "SuperAdmin")]
    public class ProducController : Controller
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        private readonly IValidationImageUploadService _validationImageUploadService;
        public ProducController(IProductRepository productRepository, 
            ICategoryService categoryService,
            IValidationImageUploadService validationImageUploadService,
            IProductService productService)
        {
            _productRepository = productRepository;
            _categoryService = categoryService;
            _validationImageUploadService = validationImageUploadService;
            _productService = productService;
        }

        [HttpGet("AddProduct")]
        public async Task<IActionResult> AddProduct()
        {
            ViewBag.IsEdit = false;
            var categories = await _categoryService.GetAllCategoriesAsync();

            ViewBag.Category = categories;
            return View();
        }

        [HttpPost("AddProduct")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddProduct(AddProductViewModel addProduct)
        {
            try
            {
                string imageUrl = string.Empty;

                if (addProduct.Image != null && addProduct.Image.Length > 0
                    && _validationImageUploadService.IsExtentionValid(addProduct.Image)
                    && _validationImageUploadService.IsMimeTypeValid(addProduct.Image))
                {
                    var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                    var uploadFolder = Path.Combine(webRootPath, "Uploads");
                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(addProduct.Image.FileName);
                    var filePath = Path.Combine(uploadFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await addProduct.Image.CopyToAsync(fileStream);
                    }

                    imageUrl = "/Uploads/" + uniqueFileName;
                }

                var product = new Product
                {
                    Name = addProduct.ProductName,
                    Description = addProduct.Description,
                    Price = addProduct.Price,
                    ImageUrl = imageUrl,
                    CategoryName = addProduct.CategoryName,
                    IsAvailable = true
                };

                await _productRepository.AddProductAsyc(product);

                TempData["SuccessMessage"] = "محصول با موفقیت اضافه شد";

                return RedirectToAction("Index", "Dashboard", new { area = "AdminDashboard" });
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "خطا در اضافه کردن محصول";
                return RedirectToAction("Index", "Dashboard", new { area = "AdminDashboard" });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProduct(int Id)
        {
            var product = await _productService.GetProductByIdAsync(Id);

            if(product != null)
            {
                await _productRepository.DeleteProductAsyc(product);
                @TempData["SuccessMessage"] = "محصول با موفقیت حذف شد";
                return RedirectToAction("Index", "Dashboard", new { area = "AdminDashboard" });
            }

            @TempData["SuccessMessage"] = "محصولی با این شناسه یافت نشد";
            return RedirectToAction("Index", "Dashboard", new { area = "AdminDashboard" });
        }
    }
}
