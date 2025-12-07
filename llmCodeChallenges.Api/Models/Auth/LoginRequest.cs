using System.ComponentModel.DataAnnotations;

namespace llmCodeChallenges.Api.Models.Auth;

public sealed class LoginRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [DataType(DataType.Password)]
    public required string Password { get; init; }
}
