# Task 5: JWT Token Service

**Objective:** Create a service that generates and validates JWT tokens. Follows SOLID's Single Responsibility and Dependency Inversion.

**Files:**
- Create: `src/AppCatalog.Api/Services/ITokenService.cs`
- Create: `src/AppCatalog.Api/Services/TokenService.cs`
- Create: `src/AppCatalog.Api/Services/TokenSettings.cs`

**Step 1: Create TokenSettings**

Create `src/AppCatalog.Api/Services/TokenSettings.cs`:

```csharp
namespace AppCatalog.Api.Services;

public class TokenSettings
{
    public const string SectionName = "TokenSettings";

    public required string Secret { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public int ExpiryMinutes { get; set; } = 60;
}
```

**Step 2: Create token service interface**

Create `src/AppCatalog.Api/Services/ITokenService.cs`:

```csharp
using AppCatalog.Api.Models;

namespace AppCatalog.Api.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
```

**Step 3: Create token service implementation**

Create `src/AppCatalog.Api/Services/TokenService.cs`:

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AppCatalog.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace AppCatalog.Api.Services;

public class TokenService : ITokenService
{
    private readonly TokenSettings _settings;
    private readonly SymmetricSecurityKey _key;

    public TokenService(TokenSettings settings)
    {
        _settings = settings;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
    }

    public string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role)
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes),
            SigningCredentials = credentials,
            Issuer = _settings.Issuer,
            Audience = _settings.Audience
        };

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);

        return handler.WriteToken(token);
    }
}
```

**Step 4: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat: add JWT token generation service"
```
