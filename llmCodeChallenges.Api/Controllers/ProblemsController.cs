using llmCodeChallenges.Api.Data;
using llmCodeChallenges.Api.Models;
using llmCodeChallenges.Api.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace llmCodeChallenges.Api.Controllers;

[ApiController]
[Route("backend/[controller]")]
public class ProblemsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ProblemsController> _logger;

    public ProblemsController(
        ApplicationDbContext context,
        IWebHostEnvironment environment,
        ILogger<ProblemsController> logger)
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProblemResponse>>> GetProblems()
    {
        var problems = await _context.Problems
            .Include(p => p.Tags)
            .ToListAsync();

        var responses = new List<ProblemResponse>();

        foreach (var problem in problems)
        {
            var markdownContent = await ReadMarkdownFileAsync(problem.FilePath);
            var language = ExtractLanguageFromTags(problem.Tags);

            responses.Add(new ProblemResponse(
                problem.Id,
                problem.Name,
                problem.Description,
                problem.Tags.Select(t => t.Value).ToArray(),
                language,
                markdownContent
            ));
        }

        return Ok(responses);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProblemResponse>> GetProblem(Guid id)
    {
        var problem = await _context.Problems
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (problem is null)
        {
            return NotFound();
        }

        var markdownContent = await ReadMarkdownFileAsync(problem.FilePath);
        var language = ExtractLanguageFromTags(problem.Tags);

        var response = new ProblemResponse(
            problem.Id,
            problem.Name,
            problem.Description,
            problem.Tags.Select(t => t.Value).ToArray(),
            language,
            markdownContent
        );

        return Ok(response);
    }

    private async Task<string> ReadMarkdownFileAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_environment.ContentRootPath, filePath.TrimStart('/'));
            
            if (!System.IO.File.Exists(fullPath))
            {
                _logger.LogWarning("Markdown file not found: {FilePath}", fullPath);
                return "# Problem content not available\n\nThe problem description file could not be found.";
            }

            return await System.IO.File.ReadAllTextAsync(fullPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading markdown file: {FilePath}", filePath);
            return "# Error loading problem\n\nAn error occurred while loading the problem description.";
        }
    }

    [HttpPost]
    [Consumes("application/json")]
    public async Task<ActionResult<ProblemResponse>> CreateProblemJson([FromBody] CreateProblemRequest request)
    {
        // Create markdown file
        var problemsDir = Path.Combine(_environment.ContentRootPath, "Problems");
        Directory.CreateDirectory(problemsDir);
        
        var fileName = $"{Guid.NewGuid()}.md";
        var filePath = Path.Combine(problemsDir, fileName);
        await System.IO.File.WriteAllTextAsync(filePath, request.MarkdownContent);

        // Create problem entity
        var problem = new Problem
        {
            Id = Guid.NewGuid(),
            Name = request.Title,
            Description = request.Description,
            FilePath = $"/Problems/{fileName}",
            Tags = request.Tags.Select(t => new Tag { Id = Guid.NewGuid(), Value = t }).ToList()
        };

        _context.Problems.Add(problem);
        await _context.SaveChangesAsync();

        var response = new ProblemResponse(
            problem.Id,
            problem.Name,
            problem.Description,
            problem.Tags.Select(t => t.Value).ToArray(),
            request.Language,
            request.MarkdownContent
        );

        return CreatedAtAction(nameof(GetProblem), new { id = problem.Id }, response);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ProblemResponse>> CreateProblemMultipart([FromForm] CreateProblemMultipartRequest request)
    {
        if (request.Markdown is null)
        {
            return BadRequest("Markdown file is required.");
        }

        // Create directories for storing files
        var problemsDir = Path.Combine(_environment.ContentRootPath, "Problems");
        var archivesDir = Path.Combine(_environment.ContentRootPath, "Archives");
        Directory.CreateDirectory(problemsDir);
        Directory.CreateDirectory(archivesDir);

        // Save markdown file
        var markdownFileName = $"{Guid.NewGuid()}.md";
        var markdownFilePath = Path.Combine(problemsDir, markdownFileName);
        await using (var stream = new FileStream(markdownFilePath, FileMode.Create))
        {
            await request.Markdown.CopyToAsync(stream);
        }

        // Read markdown content
        var markdownContent = await System.IO.File.ReadAllTextAsync(markdownFilePath);

        // Save archive file if provided
        string? archiveFileName = null;
        if (request.Archive is not null)
        {
            archiveFileName = $"{Guid.NewGuid()}.zip";
            var archiveFilePath = Path.Combine(archivesDir, archiveFileName);
            await using var stream = new FileStream(archiveFilePath, FileMode.Create);
            await request.Archive.CopyToAsync(stream);
        }

        // Parse tags from JSON string
        var tags = new List<string>();
        if (!string.IsNullOrEmpty(request.Tags))
        {
            try
            {
                tags = System.Text.Json.JsonSerializer.Deserialize<List<string>>(request.Tags) ?? new List<string>();
            }
            catch (System.Text.Json.JsonException)
            {
                _logger.LogWarning("Failed to parse tags JSON: {Tags}", request.Tags);
            }
        }

        // Add language to tags if not already present
        if (!tags.Contains(request.Language, StringComparer.OrdinalIgnoreCase))
        {
            tags.Add(request.Language);
        }

        // Create problem entity
        var problem = new Problem
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            FilePath = $"/Problems/{markdownFileName}",
            Tags = tags.Select(t => new Tag { Id = Guid.NewGuid(), Value = t }).ToList()
        };

        _context.Problems.Add(problem);
        await _context.SaveChangesAsync();

        var response = new ProblemResponse(
            problem.Id,
            problem.Name,
            problem.Description,
            problem.Tags.Select(t => t.Value).ToArray(),
            request.Language,
            markdownContent
        );

        return CreatedAtAction(nameof(GetProblem), new { id = problem.Id }, response);
    }

    private static string ExtractLanguageFromTags(ICollection<Tag> tags)
    {
        var languageTags = new[] { "Python", "JavaScript", "TypeScript", "C#", "Java", "Go", "Rust" };
        var languageTag = tags.FirstOrDefault(t => languageTags.Contains(t.Value, StringComparer.OrdinalIgnoreCase));
        return languageTag?.Value ?? "Unknown";
    }
}

public record CreateProblemRequest(
    string Title,
    string Description,
    string[] Tags,
    string Language,
    string MarkdownContent
);

public record CreateProblemMultipartRequest
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string Language { get; init; }
    public string? Tags { get; init; } // JSON string array
    public required IFormFile Markdown { get; init; }
    public IFormFile? Archive { get; init; }
}
