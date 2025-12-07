using System;
using Microsoft.AspNetCore.Identity;

namespace llmCodeChallenges.Api.Models;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    // Additional application-specific properties can go here in the future.
}
