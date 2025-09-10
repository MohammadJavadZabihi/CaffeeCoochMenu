using CaffeeCoochMenu.Infrastracture.DependecyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddRepositories();
// services which contain business logic
builder.Services.AddServices();

var app = builder.Build();

// Add roles
using (var scope = app.Services.CreateScope())
{
    var service = scope.ServiceProvider;
    await ServiceProviderExtention.RoleSeeder(service);
}

// Add super admin user
await app.AddSuperAdmin(builder.Configuration);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();


app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
