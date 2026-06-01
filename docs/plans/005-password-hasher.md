# Task 4: Password Hashing Service

**Objective:** Create a password hashing service using BCrypt for secure password storage. This follows SOLID's Single Responsibility — password hashing is isolated and swappable.

**Files:**
- Create: `src/AppCatalog.Api/Services/IPasswordHasher.cs`
- Create: `src/AppCatalog.Api/Services/BcryptPasswordHasher.cs`

**Step 1: Create password hasher interface**

Create `src/AppCatalog.Api/Services/IPasswordHasher.cs`:

```csharp
namespace AppCatalog.Api.Services;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}
```

**Step 2: Install BCrypt library**

Run:
```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog/AppCatalog.Api
dotnet add package BCrypt.Net-Next
```

**Step 3: Create BCrypt implementation**

Create `src/AppCatalog.Api/Services/BcryptPasswordHasher.cs`:

```csharp
using BCrypt.Net;

namespace AppCatalog.Api.Services;

public class BcryptPasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12;

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
```

**Step 4: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat: add BCrypt password hashing service"
```
