using CaffeeCoochMenu.Core.Entities;
using CaffeeCoochMenu.Core.Interfaces;
using CaffeeCoochMenu.Infrastracture.Persictense.Context;
using Microsoft.EntityFrameworkCore;

namespace CaffeeCoochMenu.Infrastracture.Persictense.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationContext _context;
        public CategoryService(ApplicationContext context)
        {
            _context = context;
        }

        public async Task AddCategory(string categoryName)
        {
            var newCategory = new Category
            {
                Name = categoryName
            };

            await _context.Categories.AddAsync(newCategory);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteCategory(int categoryId)
        {
            var category = await 
                _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }
    }
}
