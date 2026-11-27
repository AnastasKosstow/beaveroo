using Microsoft.Agents.AI;
using System.Text.Json;

namespace PartyPlanner.Session;

public static class SessionSerializer
{
    public static async Task SaveAsync(AIAgent agent, AgentSession session, string filePath)
    {
        JsonElement state = await agent.SerializeSessionAsync(session);

        await File.WriteAllTextAsync(filePath, state.GetRawText());
    }

    public static async Task<AgentSession> LoadAsync(AIAgent agent, string filePath)
    {
        string json = await File.ReadAllTextAsync(filePath);
        JsonElement state = JsonSerializer.Deserialize<JsonElement>(json);

        return await agent.DeserializeSessionAsync(state);
    }
}
