using AppCatalog.Api.Models;

namespace AppCatalog.Api.Data;

public interface IAppCatalogEntryRepository : IRepository<AppCatalogEntry>
{
    Task<IEnumerable<AppCatalogEntry>> GetByUserIdAsync(Guid userId);
}
