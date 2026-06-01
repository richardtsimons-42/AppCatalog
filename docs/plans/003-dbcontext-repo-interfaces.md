# Task 2: DbContext and Repository Interface

**Objective:** Create the EF Core DbContext and a generic repository interface following SOLID (Single Responsibility — data access is isolated).

**Files:**
- Create: `src/AppCatalog.Api/Data/ApplicationDbContext.cs`
- Create: `src/AppCatalog.Api/Data/IRepository.cs`
- Create: `src/AppCatalog.Api/Data/IUserRepository.cs`
- Create: `src/AppCatalog.Api/Data/IAppCatalogEntryRepository.cs`

**Step 1: Create DbContext**

Create `src/AppCatalog.Api/Data/ApplicationDbContext.cs`:

```csharp
using AppCatalog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AppCatalog.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<AppCatalogEntry> AppCatalogEntries => Set<AppCatalogEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FirstName).HasMaxLength(128);
            entity.Property(e => e.LastName).HasMaxLength(128);
            entity.Property(e => e.Role).HasMaxLength(32);
        });

        modelBuilder.Entity<AppCatalogEntry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.Name).HasMaxLength(256);
            entity.Property(e => e.Description).HasMaxLength(1024);
            entity.Property(e => e.Url).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(64);
        });
    }
}
```

**Step 2: Create generic repository interface**

Create `src/AppCatalog.Api/Data/IRepository.cs`:

```csharp
namespace AppCatalog.Api.Data;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
    Task<IEnumerable<T>> FindAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate);
}
```

**Step 3: Create user repository interface**

Create `src/AppCatalog.Api/Data/IUserRepository.cs`:

```csharp
using AppCatalog.Api.Models;

namespace AppCatalog.Api.Data;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsByEmailAsync(string email);
}
```

**Step 4: Create app catalog entry repository interface**

Create `src/AppCatalog.Api/Data/IAppCatalogEntryRepository.cs`:

```csharp
using AppCatalog.Api.Models;

namespace AppCatalog.Api.Data;

public interface IAppCatalogEntryRepository : IRepository<AppCatalogEntry>
{
    Task<IEnumerable<AppCatalogEntry>> GetByUserIdAsync(Guid userId);
}
```

**Step 5: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat: add ApplicationDbContext and repository interfaces"
```
