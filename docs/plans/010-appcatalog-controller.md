# Task 9: AppCatalogController

**Objective:** Create the AppCatalogController with full CRUD endpoints. Uses `[Authorize]` for protection.

**Files:**
- Create: `src/AppCatalog.Api/Controllers/AppCatalogController.cs`

**Step 1: Create AppCatalogController**

Create `src/AppCatalog.Api/Controllers/AppCatalogController.cs`:

```csharp
using AppCatalog.Api.DTOs;
using AppCatalog.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppCatalog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppCatalogController : ControllerBase
{
    private readonly IAppCatalogEntryService _service;

    public AppCatalogController(IAppCatalogEntryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppCatalogEntryDto>>> GetAll()
    {
        var entries = await _service.GetAllAsync();
        return Ok(entries);
    }

    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<AppCatalogEntryDto>>> GetMyApps()
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var entries = await _service.GetByUserIdAsync(userId);
        return Ok(entries);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppCatalogEntryDto>> GetById(Guid id)
    {
        var entry = await _service.GetByIdAsync(id);
        if (entry == null)
            return NotFound();
        return Ok(entry);
    }

    [HttpPost]
    public async Task<ActionResult<AppCatalogEntryDto>> Create([FromBody] AppCatalogEntryDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var created = await _service.CreateAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AppCatalogEntryDto>> Update(Guid id, [FromBody] AppCatalogEntryDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var updated = await _service.UpdateAsync(id, userId, dto);
        if (updated == null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var deleted = await _service.DeleteAsync(id, userId);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
```

**Step 2: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "feat: add AppCatalogController (full CRUD with auth)"
```
