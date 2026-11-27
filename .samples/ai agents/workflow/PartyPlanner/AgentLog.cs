using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using System.Text.Json;

namespace PartyPlanner;

public static class AgentLog
{
    public static void Print(AgentResponse response)
    {
        foreach (var line in response.Messages.SelectMany(GetLogLines))
        {
            Print(line);
        }
    }

    public static void Print(string line) => Console.WriteLine(line);

    public static void Print() => Console.WriteLine();

    private static IEnumerable<string> GetLogLines(ChatMessage message)
        =>
        message.Contents
            .Select(content => FormatLine(message, content))
            .OfType<string>();

    private static string? FormatLine(ChatMessage message, AIContent content) 
        =>
        content switch
        {
            TextContent text =>
                $"{message.AuthorName}: {text.Text}",

            FunctionCallContent call =>
                $"  Action: {call.Name}({JsonSerializer.Serialize(call.Arguments)})",

            FunctionResultContent result =>
                $"  Observation: {result.Result}",

            _ => null
        };
}
