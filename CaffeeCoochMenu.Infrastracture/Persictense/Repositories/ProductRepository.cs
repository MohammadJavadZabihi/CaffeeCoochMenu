using CaffeeCoochMenu.Core.Entities;
using CaffeeCoochMenu.Core.Exceptions;
using CaffeeCoochMenu.Core.Interfaces;
using CaffeeCoochMenu.Infrastracture.Persictense.Context;

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

        public async Task<bool> UpdateProductAsync(Product product)
        {
            try
            {
                _context.Products.Update(product);
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
