using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
   
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<UserBehavior> UserBehaviors { get; set; }
    }
}
