using llmCodeChallenges.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace llmCodeChallenges.Api.Controllers;

[ApiController]
[Route("backend/[controller]")]
public class GreetingsController : ControllerBase
{
    private static readonly string[] DefaultGreetings =
    [
        "Hello from the ASP.NET Core API!",
        "Aspire keeps every service organized.",
        "React and ASP.NET Core work better together.",
        "Remember to hydrate before you code.",
        "TypeScript all the things."
    ];

    [HttpGet]
    public ActionResult<IEnumerable<GreetingResponse>> Get()
    {
        var now = DateTimeOffset.UtcNow;
        var greetings = DefaultGreetings.Select(message => new GreetingResponse(message, now));
        return Ok(greetings);
    }
}
