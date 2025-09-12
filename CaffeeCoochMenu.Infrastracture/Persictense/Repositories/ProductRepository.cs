using CaffeeCoochMenu.Core.Entities;
using CaffeeCoochMenu.Core.Exceptions;
using CaffeeCoochMenu.Core.Interfaces;
using CaffeeCoochMenu.Infrastracture.Persictense.Context;
using Microsoft.EntityFrameworkCore;

namespace CaffeeCoochMenu.Infrastracture.Persictense.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationContext _context;
        public ProductRepository(ApplicationContext context)
        {
            _context = context;
        }
        public async Task AddProductAsyc(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteProductAsyc(Product product)
        {
            try
            {
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    var oldFilePath = Path.Combine(webRootPath, product.ImageUrl.TrimStart('/'));
                    if (File.Exists(oldFilePath))
                    {
                        File.Delete(oldFilePath);
                    }
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (CustomeException)
            {
                throw new CustomeException("حذف کالای مورد نظر با مشکل مواجه شد، لطفا بعدا دوباره تلاش فرمایید");
            }
        }

        public async Task<bool> UpdateProductAsync(int id, Product product)
        {
            try
            {
                var existProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

                if (existProduct == null) return false;

                existProduct.IsPopular = product.IsPopular;
                existProduct.IsAvailable = product.IsAvailable;
                existProduct.Name = product.Name;
                existProduct.Description = product.Description;
                existProduct.Price = product.Price;

                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    if (!string.IsNullOrEmpty(existProduct.ImageUrl))
                    {
                        var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                        var oldFilePath = Path.Combine(webRootPath, existProduct.ImageUrl.TrimStart('/'));
                        if (File.Exists(oldFilePath))
                        {
                            File.Delete(oldFilePath);
                        }
                    }

                    existProduct.ImageUrl = product.ImageUrl;
                }

                _context.Products.Update(existProduct);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (CustomeException)
            {
                throw new CustomeException("به روز رسانی کالای مورد نظر با مشکل مواجه شد، لطفا بعدا دوباره تلاش فرمایید");
            }
        }
    }
}
