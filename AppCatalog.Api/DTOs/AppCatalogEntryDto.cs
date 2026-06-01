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
