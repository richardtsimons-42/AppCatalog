# Task 11: Test Setup — WebApplicationFactory

**Objective:** Create a test factory that configures an in-memory database for integration tests.

**Files:**
- Create: `src/AppCatalog.Api.Tests/TestWebApplicationFactory.cs`

**Step 1: Create test factory**

Create `src/AppCatalog.Api.Tests/TestWebApplicationFactory.cs`:

```csharp
using AppCatalog.Api.Data;
using AppCatalog.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace AppCatalog.Api.Tests;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove existing DbContext and registrations
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            // Add in-memory DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase("AppCatalogTestDb");
            });

            // Replace repository services with in-memory implementations
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IAppCatalogEntryRepository, AppCatalogEntryRepository>();

            // Replace password hasher and token service (use real impls, they're stateless)
            services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
            services.AddScoped<ITokenService, TokenService>();

            // Replace auth and catalog services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAppCatalogEntryService, AppCatalogEntryService>();
        });
    }
}
```

**Step 2: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "test: add TestWebApplicationFactory with in-memory DB"
```
