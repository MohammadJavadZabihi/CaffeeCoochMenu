using CaffeeCoochMenu.Core.Entities;
using CaffeeCoochMenu.Core.Interfaces;
using CaffeeCoochMenu.Infrastracture.Persictense.Context;
using Microsoft.EntityFrameworkCore;

namespace CaffeeCoochMenu.Infrastracture.Persictense.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationContext _context;
        public ProductService(ApplicationContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Product?>> GetAllProductsAsync(int pageIndex = 0, int pageSize = 10, string filter = "")
        {
            IQueryable<Product> query = _context.Products;

            if(!string.IsNullOrEmpty(filter) && filter != "all")
            {
                query = query.Where(p => p.CategoryName == filter);
            }

            query = query.OrderByDescending(p => p.CreatedAt);

            if(pageIndex >= 1)
            {
                var indexResult = await query.Skip((pageIndex - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return indexResult;
            }

            var result = await query.ToListAsync();

            return result;
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(
                p => p.Id == id);

            return product;
        }
    }
}
