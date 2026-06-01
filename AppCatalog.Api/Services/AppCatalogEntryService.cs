using AppCatalog.Api.Data;
using AppCatalog.Api.DTOs;
using AppCatalog.Api.Models;

namespace AppCatalog.Api.Services;

public class AppCatalogEntryService : IAppCatalogEntryService
{
    private readonly IAppCatalogEntryRepository _repository;

    public AppCatalogEntryService(IAppCatalogEntryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AppCatalogEntryDto>> GetAllAsync()
    {
        var entries = await _repository.GetAllAsync();
        return entries.Select(ToDto);
    }

    public async Task<IEnumerable<AppCatalogEntryDto>> GetByUserIdAsync(Guid userId)
    {
        var entries = await _repository.GetByUserIdAsync(userId);
        return entries.Select(ToDto);
    }

    public async Task<AppCatalogEntryDto?> GetByIdAsync(Guid id)
    {
        var entry = await _repository.GetByIdAsync(id);
        return entry != null ? ToDto(entry) : null;
    }

    public async Task<AppCatalogEntryDto> CreateAsync(Guid userId, AppCatalogEntryDto dto)
    {
        var entry = new AppCatalogEntry
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            Url = dto.Url,
            IconUrl = dto.IconUrl,
            Category = dto.Category,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entry);
        return ToDto(entry);
    }

    public async Task<AppCatalogEntryDto?> UpdateAsync(Guid id, Guid userId, AppCatalogEntryDto dto)
    {
        var entry = await _repository.GetByIdAsync(id);

        if (entry == null || entry.UserId != userId)
        {
            return null;
        }

        entry.Name = dto.Name;
        entry.Description = dto.Description;
        entry.Url = dto.Url;
        entry.IconUrl = dto.IconUrl;
        entry.Category = dto.Category;
        entry.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entry);
        return ToDto(entry);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var entry = await _repository.GetByIdAsync(id);

        if (entry == null || entry.UserId != userId)
        {
            return false;
        }

        await _repository.DeleteAsync(id);
        return true;
    }

    private static AppCatalogEntryDto ToDto(AppCatalogEntry entry)
    {
        return new AppCatalogEntryDto
        {
            Id = entry.Id,
            Name = entry.Name,
            Description = entry.Description,
            Url = entry.Url,
            IconUrl = entry.IconUrl,
            Category = entry.Category,
            UserId = entry.UserId,
            CreatedAt = entry.CreatedAt,
            UpdatedAt = entry.UpdatedAt
        };
    }
}
