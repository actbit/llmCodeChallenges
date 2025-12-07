using System.ComponentModel.DataAnnotations;

namespace llmCodeChallenges.Api.Models.Auth;

public sealed class RegisterRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [DataType(DataType.Password)]
    [MinLength(6)]
    public required string Password { get; init; }
}
