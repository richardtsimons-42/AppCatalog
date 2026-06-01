using AppCatalog.Api.DTOs;
using AppCatalog.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
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
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var created = await _service.CreateAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AppCatalogEntryDto>> Update(Guid id, [FromBody] AppCatalogEntryDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var updated = await _service.UpdateAsync(id, userId, dto);
        if (updated == null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var deleted = await _service.DeleteAsync(id, userId);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
