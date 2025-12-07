using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// Frontend dev server with explicit HTTP endpoint
var web = builder.AddNpmApp("frontend", "../llmCodeChallenges.Web", "dev")
    .WithHttpEndpoint(name: "http", env: "VITE_PORT")
    .WithExternalHttpEndpoints();

// API with external endpoints, referencing frontend HTTP endpoint for YARP
var api = builder.AddProject<Projects.llmCodeChallenges_Api>("api")
    .WithReference(web.GetEndpoint("http"))
    .WithExternalHttpEndpoints();

builder.Build().Run();
