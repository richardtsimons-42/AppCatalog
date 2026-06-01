# Task 12: Auth Controller Tests

**Objective:** Write integration tests for registration and login endpoints.

**Files:**
- Create: `src/AppCatalog.Api.Tests/Controllers/AuthControllerTests.cs`

**Step 1: Create auth controller tests**

Create `src/AppCatalog.Api.Tests/Controllers/AuthControllerTests.cs`:

```csharp
using AppCatalog.Api.DTOs;
using AppCatalog.Api.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace AppCatalog.Api.Tests.Controllers;

public class AuthControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory _factory;

    public AuthControllerTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ValidData_ReturnsCreated()
    {
        var request = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "Test",
            LastName = "User"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        Assert.Equal("test@example.com", result.Email);
    }

    [Fact]
    public async Task Register_DuplicateEmail_ReturnsBadRequest()
    {
        var request = new RegisterRequest
        {
            Email = "dup@example.com",
            Password = "Password123!",
            FirstName = "Dup",
            LastName = "User"
        };

        await _client.PostAsJsonAsync("/api/auth/register", request);
        var response = await _client.PostAsJsonAsync("/api/auth/register", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsOk()
    {
        // Register first
        var reg = new RegisterRequest
        {
            Email = "login@test.com",
            Password = "Password123!",
            FirstName = "Login",
            LastName = "Test"
        };
        await _client.PostAsJsonAsync("/api/auth/register", reg);

        // Login
        var loginReq = new LoginRequest
        {
            Email = "login@test.com",
            Password = "Password123!"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/login", loginReq);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized()
    {
        // Register first
        var reg = new RegisterRequest
        {
            Email = "wrongpass@test.com",
            Password = "Password123!",
            FirstName = "Wrong",
            LastName = "Pass"
        };
        await _client.PostAsJsonAsync("/api/auth/register", reg);

        // Login with wrong password
        var loginReq = new LoginRequest
        {
            Email = "wrongpass@test.com",
            Password = "WrongPassword1!"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/login", loginReq);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
```

**Step 2: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "test: add AuthController integration tests (register, login)"
```
