using CaffeeCoochMenu.Core.Interfaces;
using Microsoft.AspNetCore.Http;

namespace CaffeeCoochMenu.Infrastracture.Persictense.Services
{
    public class ValidationImageUploadService : IValidationImageUploadService
    {
        private readonly static string[] _validExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private readonly static string[] _allowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };
        public bool IsExtentionValid(IFormFile file)
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(ext) || !_validExtensions.Contains(ext))
            {
                return false;
            }

            return true;
        }

        public bool IsMimeTypeValid(IFormFile file)
        {
            return _allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant());
        }
    }
}
