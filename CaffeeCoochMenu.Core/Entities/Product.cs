using CaffeeCoochMenu.Core.Commons;

namespace CaffeeCoochMenu.Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; }
        public string ImageUrl { get; set; }
        public string CategoryName { get; set; }
        public bool IsPopular { get; set; }
        public bool IsAvailable { get; set; }
    }
}
