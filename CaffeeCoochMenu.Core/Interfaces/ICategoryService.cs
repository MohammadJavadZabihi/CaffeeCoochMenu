using CaffeeCoochMenu.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace CaffeeCoochMenu.Core.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task AddCategory(string categoryName, string imageUrl);
        Task<bool> DeleteCategory(int categoryId);
    }
}
