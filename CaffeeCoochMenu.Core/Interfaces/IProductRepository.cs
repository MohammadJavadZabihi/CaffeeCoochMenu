using CaffeeCoochMenu.Core.Entities;

namespace CaffeeCoochMenu.Core.Interfaces
{
    public interface IProductRepository
    {
        Task AddProductAsyc(Product product);
        Task<bool> DeleteProductAsyc(Product product);
        Task<bool> UpdateProductAsync(Product product);
    }
}
