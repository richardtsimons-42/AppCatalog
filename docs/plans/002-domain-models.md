# Task 1: Domain Models

**Objective:** Create the core domain entities: User, AppCatalogEntry, and the DTOs for registration/login.

**Files:**
- Create: `src/AppCatalog.Api/Models/User.cs`
- Create: `src/AppCatalog.Api/Models/AppCatalogEntry.cs`
- Create: `src/AppCatalog.Api/DTOs/RegisterRequest.cs`
- Create: `src/AppCatalog.Api/DTOs/LoginRequest.cs`
- Create: `src/AppCatalog.Api/DTOs/LoginResponse.cs`
- Create: `src/AppCatalog.Api/DTOs/AppCatalogEntryDto.cs`

**Step 1: Create User model**

Create `src/AppCatalog.Api/Models/User.cs`:

```csharp
namespace AppCatalog.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string Role { get; set; } = "User"; // "User" or "Admin"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
```

**Step 2: Create AppCatalogEntry model**

Create `src/AppCatalog.Api/Models/AppCatalogEntry.cs`:

```csharp
namespace AppCatalog.Api.Models;

public class AppCatalogEntry
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Url { get; set; }
    public string? IconUrl { get; set; }
    public string? Category { get; set; }
    public Guid UserId { get; set; }
    public User? Owner { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
```

**Step 3: Create DTOs**

Create `src/AppCatalog.Api/DTOs/RegisterRequest.cs`:

```csharp
namespace AppCatalog.Api.DTOs;

public class RegisterRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}
```

Create `src/AppCatalog.Api/DTOs/LoginRequest.cs`:

```csharp
namespace AppCatalog.Api.DTOs;

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}
```

Create `src/AppCatalog.Api/DTOs/LoginResponse.cs`:

```csharp
namespace AppCatalog.Api.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
```

Create `src/AppCatalog.Api/DTOs/AppCatalogEntryDto.cs`:

```csharp
namespace AppCatalog.Api.DTOs;

public class AppCatalogEntryDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Url { get; set; }
    public string? IconUrl { get; set; }
    public string? Category { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

**Step 4: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat: add domain models and DTOs (User, AppCatalogEntry, auth DTOs)"
```
