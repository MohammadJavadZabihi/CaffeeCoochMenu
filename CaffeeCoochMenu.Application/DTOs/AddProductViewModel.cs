using Microsoft.AspNetCore.Http;

namespace CaffeeCoochMenu.Application.DTOs
{
    public class AddProductViewModel
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public IFormFile Image { get; set; }
        public string CategoryName { get; set; }
        public bool IsPopular { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}
