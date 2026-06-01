namespace AppCatalog.Api.Services;

public class TokenSettings
{
    public const string SectionName = "TokenSettings";

    public required string Secret { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public int ExpiryMinutes { get; set; } = 60;
}
