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
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return true;
            }
            catch(CustomeException)
            {
                throw new CustomeException("حذف کالای مورد نظر با مشکل مواجه شد، " +
                    "لطفا بعدا دوباره تلاش فرمایید");
            }
        }

        public async Task<bool> UpdateProductAsync(int id, Product product)
        {
            try
            {
                var exixstProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

                exixstProduct.IsPopular = product.IsPopular;
                exixstProduct.IsAvailable = product.IsAvailable;
                exixstProduct.Name = product.Name;
                exixstProduct.Description = product.Description;
                exixstProduct.Price = product.Price;
                exixstProduct.CategoryName = product.CategoryName;
                exixstProduct.ImageUrl = product.ImageUrl;

                _context.Products.Update(exixstProduct);
                await _context.SaveChangesAsync();

                return true;
            }
            catch(CustomeException)
            {
                throw new CustomeException("به روز رسانی کالای مورد نظر با مشکل مواجه شد، " +
    "لطفا بعدا دوباره تلاش فرمایید");
            }
        }
    }
}
