using System.ComponentModel.DataAnnotations;

namespace CaffeeCoochMenu.Core.Commons
{
    public class BaseEntity
    {
        [Key]
        public int Id { get; protected set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
