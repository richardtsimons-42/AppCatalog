using AppCatalog.Api.Models;

namespace AppCatalog.Api.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
