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
        private readonly IWebHostEnvironment _env;
        private readonly IValidationImageUploadService _validationImageUploadService;
        public ProducController(IProductRepository productRepository, 
            ICategoryService categoryService,
            IValidationImageUploadService validationImageUploadService,
            IProductService productService,
            IWebHostEnvironment env)
        {
            _productRepository = productRepository;
            _categoryService = categoryService;
            _validationImageUploadService = validationImageUploadService;
            _productService = productService;
            _env = env;
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

                return RedirectToAction("ProductIndex", "Dashboard", new { area = "AdminDashboard" });
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "خطا در اضافه کردن محصول";
                return RedirectToAction("ProductIndex", "Dashboard", new { area = "AdminDashboard" });
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
                return RedirectToAction("ProductIndex", "Dashboard", new { area = "AdminDashboard" });
            }

            @TempData["SuccessMessage"] = "محصولی با این شناسه یافت نشد";
            return RedirectToAction("ProductIndex", "Dashboard", new { area = "AdminDashboard" });
        }

        [HttpGet("EditProduct/{Id}")]
        public async Task<IActionResult> EditProduct(int Id)
        {
            var product = await _productService.GetProductByIdAsync(Id);
            var categories = await _categoryService.GetAllCategoriesAsync();

            var editeProduct = new ProductEditeViewModel
            {
                Id = product.Id,
                ProductName = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryName = product.CategoryName,
                ImageUrl = product.ImageUrl
            };

            ViewBag.IsEdit = true;
            ViewBag.Category = categories;
            ViewBag.PageTitle = "ویرایش محصول";
            ViewBag.Product = editeProduct;

            return View(editeProduct);
        }

        [HttpPost("EditProduct")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProduct(ProductEditeViewModel model)
        {
            if (model.Image != null && model.Image.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath, "uploads");
                Directory.CreateDirectory(uploads);

                var fileName = Guid.NewGuid() + Path.GetExtension(model.Image.FileName);
                var filePath = Path.Combine(uploads, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }

            var product = new Product
            {
                Name = model.ProductName,
                Description = model.Description,
                Price = model.Price,
                ImageUrl = model.ImageUrl,
                CategoryName = model.CategoryName,
                IsPopular = model.IsPopular,
                IsAvailable = model.IsAvailable
            };

            var resutl = await _productRepository.UpdateProductAsync(model.Id, product);

            if (resutl)
            {
                TempData["SuccessMessage"] = "محصول با موفقیت ویرایش شد";
                return RedirectToAction("ProductIndex", "Dashboard", new { area = "AdminDashboard" });
            }

            TempData["ErrorrMessage"] = "خطا در بروزرسانی محصول، لطفا بعدا دوباره تلاش فرمایید";
            return RedirectToAction("ProductIndex", "Dashboard", new { area = "AdminDashboard" });
        }
    }
}
