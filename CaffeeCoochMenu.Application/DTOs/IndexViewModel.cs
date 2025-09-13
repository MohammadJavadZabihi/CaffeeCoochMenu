using CaffeeCoochMenu.Core.Entities;

namespace CaffeeCoochMenu.Application.DTOs
{
    public class IndexViewModel
    {
        public IEnumerable<Product?> Products { get; set; }
        public IEnumerable<Category?> Categories { get; set; }
        public string CurrentCategory { get; set; } = "";
    }
}
