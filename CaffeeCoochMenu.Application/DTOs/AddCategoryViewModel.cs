using Microsoft.AspNetCore.Http;

namespace CaffeeCoochMenu.Application.DTOs
{
    public class AddCategoryViewModel
    {
        public string CategoryName { get; set; }
        public IFormFile Image { get; set; }
    }
}
