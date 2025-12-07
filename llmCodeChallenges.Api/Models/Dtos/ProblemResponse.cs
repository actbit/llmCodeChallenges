namespace llmCodeChallenges.Api.Models.Dtos;

public sealed record ProblemResponse(
    Guid Id,
    string Name,
    string? Description,
    string[] Tags,
    string Language,
    string MarkdownContent
);
