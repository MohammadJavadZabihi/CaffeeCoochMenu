using CaffeeCoochMenu.Core.Entities;

namespace CaffeeCoochMenu.Core.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product?>> GetAllProductsAsync(int pageIndex = 0,
            int pageSize = 10, string filter = "");
        Task<Product?> GetProductByIdAsync(int id);
    }
}
