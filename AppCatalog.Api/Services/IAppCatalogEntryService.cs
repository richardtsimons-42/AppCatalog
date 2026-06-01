using AppCatalog.Api.DTOs;

namespace AppCatalog.Api.Services;

public interface IAppCatalogEntryService
{
    Task<IEnumerable<AppCatalogEntryDto>> GetAllAsync();
    Task<IEnumerable<AppCatalogEntryDto>> GetByUserIdAsync(Guid userId);
    Task<AppCatalogEntryDto?> GetByIdAsync(Guid id);
    Task<AppCatalogEntryDto> CreateAsync(Guid userId, AppCatalogEntryDto dto);
    Task<AppCatalogEntryDto?> UpdateAsync(Guid id, Guid userId, AppCatalogEntryDto dto);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
