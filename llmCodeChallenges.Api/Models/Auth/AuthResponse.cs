using System;

namespace llmCodeChallenges.Api.Models.Auth;

public sealed class AuthResponse
{
    public AuthResponse(Guid userId, string userName)
    {
        UserId = userId;
        UserName = userName;
    }

    public Guid UserId { get; }

    public string UserName { get; }
}
