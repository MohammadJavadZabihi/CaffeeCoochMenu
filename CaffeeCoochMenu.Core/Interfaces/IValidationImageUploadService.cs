using Microsoft.AspNetCore.Http;

namespace CaffeeCoochMenu.Core.Interfaces
{
    public interface IValidationImageUploadService
    {
        bool IsExtentionValid(IFormFile file);
        bool IsMimeTypeValid(IFormFile file);
    }
}
