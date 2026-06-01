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
