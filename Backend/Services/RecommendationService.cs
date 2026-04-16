using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class RecommendationService
    {
        private readonly AppDbContext _context;

        public RecommendationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetRecommendations(int userId)
        {
            return await _context.Products
                .Include(p => p.Category)
                .OrderByDescending(p => p.Rating)
                .Take(3)
                .ToListAsync();
        }
    }
}
