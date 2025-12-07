using System;
using System.Collections.Generic;

namespace llmCodeChallenges.Api.Models;

public sealed class Problem
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string FilePath { get; set; }

    public string? Description { get; set; }

    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
