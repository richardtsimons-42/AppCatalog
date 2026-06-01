# Task 13: AppCatalog Controller Tests

**Objective:** Write integration tests for the AppCatalog CRUD endpoints with authentication.

**Files:**
- Create: `src/AppCatalog.Api.Tests/Controllers/AppCatalogControllerTests.cs`

**Step 1: Create helper method for auth header**

Add a helper to generate JWT tokens for tests. We'll need to register a user and get a token.

Create `src/AppCatalog.Api.Tests/Controllers/AppCatalogControllerTests.cs`:

```csharp
using AppCatalog.Api.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace AppCatalog.Api.Tests.Controllers;

public class AppCatalogControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory _factory;

    public AppCatalogControllerTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<string> LoginAndGetToken(string email, string password)
    {
        var request = new LoginRequest { Email = email, Password = password };
        var response = await _client.PostAsJsonAsync("/api/auth/login", request);
        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
        return result!.Token;
    }

    private async Task RegisterUser(string email, string password)
    {
        var request = new RegisterRequest
        {
            Email = email,
            Password = password,
            FirstName = "Test",
            LastName = "User"
        };
        await _client.PostAsJsonAsync("/api/auth/register", request);
    }

    [Fact]
    public async Task GetMyApps_Unauthorized_Returns401()
    {
        var response = await _client.GetAsync("/api/appcatalog/my");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateApp_ValidData_ReturnsCreated()
    {
        await RegisterUser("create@test.com", "Password123!");
        var token = await LoginAndGetToken("create@test.com", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var entry = new AppCatalogEntryDto
        {
            Name = "My App",
            Description = "A test app",
            Url = "https://example.com",
            Category = "Development"
        };

        var response = await _client.PostAsJsonAsync("/api/appcatalog", entry);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<AppCatalogEntryDto>();
        Assert.NotNull(result);
        Assert.Equal("My App", result.Name);
    }

    [Fact]
    public async Task GetMyApps_ReturnsUserApps()
    {
        await RegisterUser("getmy@test.com", "Password123!");
        var token = await LoginAndGetToken("getmy@test.com", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create an app first
        var entry = new AppCatalogEntryDto
        {
            Name = "Get Test App",
            Description = "For testing",
            Url = "https://gettest.com",
            Category = "Test"
        };
        await _client.PostAsJsonAsync("/api/appcatalog", entry);

        // Get my apps
        var response = await _client.GetAsync("/api/appcatalog/my");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var results = await response.Content.ReadFromJsonAsync<System.Collections.Generic.IEnumerable<AppCatalogEntryDto>>();
        Assert.NotNull(results);
        Assert.Single(results);
        Assert.Equal("Get Test App", results.First().Name);
    }

    [Fact]
    public async Task DeleteApp_NotOwner_Returns404()
    {
        // Register two users
        await RegisterUser("owner@test.com", "Password123!");
        await RegisterUser("other@test.com", "Password123!");

        // Owner creates an app
        var ownerToken = await LoginAndGetToken("owner@test.com", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ownerToken);

        var entry = new AppCatalogEntryDto
        {
            Name = "Owner App",
            Description = "Owner's app",
            Url = "https://owner.com",
            Category = "Test"
        };
        var createResp = await _client.PostAsJsonAsync("/api/appcatalog", entry);
        var created = await createResp.Content.ReadFromJsonAsync<AppCatalogEntryDto>();

        // Other user tries to delete
        var otherToken = await LoginAndGetToken("other@test.com", "Password123!");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", otherToken);

        var deleteResp = await _client.DeleteAsync($"/api/appcatalog/{created!.Id}");
        Assert.Equal(HttpStatusCode.NotFound, deleteResp.StatusCode);
    }
}
```

**Step 2: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "test: add AppCatalogController integration tests (CRUD, auth enforcement)"
```
