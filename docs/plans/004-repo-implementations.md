# Task 3: Repository Implementations

**Objective:** Implement the generic repository and specific repository classes following SOLID (Dependency Inversion — repositories depend on abstractions, Open/Closed — easy to extend).

**Files:**
- Create: `src/AppCatalog.Api/Data/Repository.cs`
- Create: `src/AppCatalog.Api/Data/UserRepository.cs`
- Create: `src/AppCatalog.Api/Data/AppCatalogEntryRepository.cs`

**Step 1: Create generic repository**

Create `src/AppCatalog.Api/Data/Repository.cs`:

```csharp
using Microsoft.EntityFrameworkCore;

namespace AppCatalog.Api.Data;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public virtual async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await Task.CompletedTask;
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
        }
    }

    public virtual async Task<IEnumerable<T>> FindAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }
}
```

**Step 2: Create UserRepository**

Create `src/AppCatalog.Api/Data/UserRepository.cs`:

```csharp
using AppCatalog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AppCatalog.Api.Data;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }
}
```

**Step 3: Create AppCatalogEntryRepository**

Create `src/AppCatalog.Api/Data/AppCatalogEntryRepository.cs`:

```csharp
using AppCatalog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AppCatalog.Api.Data;

public class AppCatalogEntryRepository : Repository<AppCatalogEntry>, IAppCatalogEntryRepository
{
    public AppCatalogEntryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<AppCatalogEntry>> GetByUserIdAsync(Guid userId)
    {
        return await _dbSet
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }
}
```

**Step 4: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat: implement generic and specific repositories"
```
