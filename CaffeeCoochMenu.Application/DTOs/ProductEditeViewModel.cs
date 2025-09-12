using Microsoft.AspNetCore.Http;

namespace CaffeeCoochMenu.Application.DTOs
{
    public class ProductEditeViewModel
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public IFormFile Image { get; set; }
        public string ImageUrl { get; set; }
        public string CategoryName { get; set; }
        public bool IsPopular { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}
