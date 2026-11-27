using System.Text.Json;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;

namespace PartyPlanner.Middlewares;

public static class TeamTraceMiddleware
{
    public static AIAgent WithTrace(this AIAgent agent)
        =>
        agent.AsBuilder().Use(LogCall).Build();

    private static async ValueTask<object?> LogCall(
        AIAgent agent,
        FunctionInvocationContext context,
        Func<FunctionInvocationContext, CancellationToken, ValueTask<object?>> next,
        CancellationToken cancellationToken)
    {
        string arguments = JsonSerializer.Serialize(context.Arguments);
        Console.WriteLine($"  [{agent.Name}] calls {context.Function.Name}({arguments})");

        return await next(context, cancellationToken);
    }
}
