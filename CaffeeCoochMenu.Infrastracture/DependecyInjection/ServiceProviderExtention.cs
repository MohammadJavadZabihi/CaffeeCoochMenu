using CaffeeCoochMenu.Core.Entities;
using CaffeeCoochMenu.Core.Interfaces;
using CaffeeCoochMenu.Infrastracture.Persictense.Context;
using CaffeeCoochMenu.Infrastracture.Persictense.Repositories;
using CaffeeCoochMenu.Infrastracture.Persictense.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CaffeeCoochMenu.Infrastracture.DependecyInjection
{
    public static class ServiceProviderExtention
    {
        public static void AddInfrastructureServices(this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionSetring 
                = configuration.GetConnectionString("CaffeeCoochMenuContext");

            services.AddDbContext<ApplicationContext>(options =>
            {
                options.UseSqlServer(connectionSetring);
            });

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            }).AddRoleManager<RoleManager<IdentityRole>>()
            .AddEntityFrameworkStores<ApplicationContext>()
            .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(services =>
            {
                services.LoginPath = "/Account/Login";
                services.AccessDeniedPath = "/Account/AccessDenied";
                services.ExpireTimeSpan = TimeSpan.FromDays(7);
            });
        }

        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddTransient<IProductRepository, ProductRepository>();
        }

        public static void AddServices(this IServiceCollection services)
        {
            services.AddTransient<IProductService, ProductService>();
        }
    }
}
