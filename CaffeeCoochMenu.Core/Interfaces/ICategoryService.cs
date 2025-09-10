using CaffeeCoochMenu.Core.Entities;

namespace CaffeeCoochMenu.Core.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task AddCategory(string categoryName);
        Task<bool> DeleteCategory(int categoryId);
    }
}
