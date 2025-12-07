using System;

namespace llmCodeChallenges.Api.Models;

public sealed class Tag
{
    public Guid Id { get; set; }

    public required string Value { get; set; }

    public Guid ProblemId { get; set; }

    public Problem? Problem { get; set; }
}
