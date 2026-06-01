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
