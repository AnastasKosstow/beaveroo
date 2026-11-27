using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using PartyPlanner.Tools;
using System.Diagnostics;
using System.Text.Json;

namespace PartyPlanner.Middlewares;

public static class AlfredMiddleware
{
    public static async Task<AgentResponse> MeasureRun(
        IEnumerable<ChatMessage> messages,
        AgentSession? session,
        AgentRunOptions? options,
        AIAgent innerAgent,
        CancellationToken cancellationToken)
    {
        Stopwatch watch = Stopwatch.StartNew();

        AgentResponse response = await innerAgent.RunAsync(messages, session, options, cancellationToken);

        Console.WriteLine($"  [run: {watch.Elapsed.TotalSeconds:F0} s, {response.Usage?.TotalTokenCount} tokens]");

        return response;
    }

    public static async Task<AgentResponse> ProtectBatcave(
        IEnumerable<ChatMessage> messages,
        AgentSession? session,
        AgentRunOptions? options,
        AIAgent innerAgent,
        CancellationToken cancellationToken)
    {
        var messagesAsText = messages.Select(x => x.Text).ToList();
        if (messagesAsText.Contains("Batcave"))
        {
            return new AgentResponse(new ChatMessage(ChatRole.Assistant, "I am afraid I cannot discuss that, sir.")
            {
                AuthorName = innerAgent.Name,
            });
        }

        return await innerAgent.RunAsync(messages, session, options, cancellationToken);
    }

    public static async ValueTask<object?> AskBeforeOrdering(
        AIAgent agent,
        FunctionInvocationContext context,
        Func<FunctionInvocationContext, CancellationToken, ValueTask<object?>> next,
        CancellationToken cancellationToken)
    {
        if (context.Function.Name == nameof(PartyTools.OrderCatering))
        {
            string arguments = JsonSerializer.Serialize(context.Arguments);
            Console.Write($"  {agent.Name} wants to call {context.Function.Name}({arguments}). Allow? (y/n): ");

            if (Console.ReadLine()?.Trim().ToLowerInvariant() != "y")
            {
                return "The user did not approve this action.";
            }
        }

        return await next(context, cancellationToken);
    }
}
