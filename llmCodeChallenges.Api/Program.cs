using Microsoft.Extensions.Hosting;
using Yarp.ReverseProxy.Forwarder;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddProblemDetails();
builder.Services.AddControllers();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpForwarder();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Enable Swagger UI
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "LLM Code Challenges API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthorization();

// API routes
app.MapControllers();
app.MapDefaultEndpoints();

// Debug endpoint
app.MapGet("/debug/config", (IConfiguration config) => new
{
    FrontendHttps = config["services:frontend:https:0"],
    FrontendHttp = config["services:frontend:http:0"],
    AllKeys = config.AsEnumerable().Where(x => x.Key.Contains("frontend")).ToDictionary(x => x.Key, x => x.Value)
});

// Forward any non-API request (including static assets) to the frontend using Aspire service discovery
app.MapFallback("{*path}", async (HttpContext context, IHttpForwarder forwarder, IConfiguration configuration, ILogger<Program> logger) =>
{
    // Exclude backend, swagger, debug, and health endpoints from forwarding
    var path = context.Request.Path.Value?.ToLowerInvariant() ?? "";
    if (path.StartsWith("/backend") ||
        path.StartsWith("/swagger") ||
        path.StartsWith("/debug") ||
        path.StartsWith("/health") ||
        path.StartsWith("/_health"))
    {
        context.Response.StatusCode = 404;
        return;
    }

    // Get frontend service URL from Aspire service discovery (prefer HTTP for Vite dev server)
    var frontendUrl = configuration["services:frontend:http:0"]
        ?? configuration["services:frontend:https:0"]
        ?? "http://localhost:5173";

    logger.LogInformation("Forwarding {Path} to {FrontendUrl}", context.Request.Path, frontendUrl);

    // Forward everything else to frontend
    var httpClient = new HttpMessageInvoker(new SocketsHttpHandler
    {
        UseProxy = false,
        AllowAutoRedirect = false,
        AutomaticDecompression = System.Net.DecompressionMethods.None,
        UseCookies = false
    });

    var requestOptions = new ForwarderRequestConfig { ActivityTimeout = TimeSpan.FromSeconds(100) };
    var transformer = HttpTransformer.Default;
    var error = await forwarder.SendAsync(context, frontendUrl, httpClient, requestOptions, transformer);
    if (error != ForwarderError.None)
    {
        logger.LogError("YARP forwarding error: {Error} for path {Path}", error, context.Request.Path);
        // レスポンスがまだ開始されていない場合のみエラーを書き込む
        if (!context.Response.HasStarted)
        {
            context.Response.StatusCode = StatusCodes.Status502BadGateway;
            await context.Response.WriteAsync($"Proxy error: {error}");
        }
        else
        {
            context.Abort();
        }
    }
});

app.Run();
