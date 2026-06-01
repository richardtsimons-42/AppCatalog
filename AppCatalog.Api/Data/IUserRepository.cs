using AppCatalog.Api.Models;

namespace AppCatalog.Api.Data;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsByEmailAsync(string email);
}
