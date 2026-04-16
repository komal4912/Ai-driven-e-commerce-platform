using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<RecommendationService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("CollegeProjectDb")); 


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.UseCors("AllowAll");

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    SeedData(context);
}

app.MapControllers();

app.MapGet("/", () => "Product Recommendation API is running!");

app.Run();

void SeedData(AppDbContext context)
{
    if (!context.Categories.Any())
    {
        var electronics = new Category { Name = "Electronics" };
        var books = new Category { Name = "Books" };
        context.Categories.AddRange(electronics, books);
        context.SaveChanges();

        context.Products.AddRange(
            new Product { Name = "Laptop", Description = "High performance laptop", Price = 999, CategoryId = electronics.Id, ViewCount = 10, Rating = 4.5m, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60" },
            new Product { Name = "Smartphone", Description = "Latest model smartphone", Price = 699, CategoryId = electronics.Id, ViewCount = 50, Rating = 4.8m, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60" },
            new Product { Name = "C# Programming", Description = "Learn C# easily", Price = 45, CategoryId = books.Id, ViewCount = 5, Rating = 4.2m, ImageUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60" }
        );
        context.SaveChanges();
    }
}
