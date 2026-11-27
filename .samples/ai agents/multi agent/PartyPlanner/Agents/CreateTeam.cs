using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using PartyPlanner.Middlewares;
using PartyPlanner.Tools;

namespace PartyPlanner.Agents;

public static class CreateTeam
{
    public static AIAgent CreatePartyTeam(this IChatClient model)
    {
        AIAgent chef = model.CreateChef();
        AIAgent dj = model.CreateDj();
        AIAgent decorator = model.CreateDecorator();

        return model.CreateAlfred(chef, dj, decorator);
    }


    private static AIAgent CreateChef(this IChatClient model) 
        =>
        model.AsAIAgent(
            name: "Chef",
            description: "Plans the food for an event: suggests a menu and finds a catering service.",
            instructions:
                "You are the chef of Wayne Manor. You plan the food for events. " +
                "Use your tools and never invent their results. Answer in one or two sentences.",
            tools:
            [
                AIFunctionFactory.Create(PartyTools.SuggestMenu),
                AIFunctionFactory.Create(PartyTools.FindBestCatering),
            ])
        .WithTrace();


    private static AIAgent CreateDj(this IChatClient model) 
        =>
        model.AsAIAgent(
            name: "DJ",
            description: "Plans the music for an event: suggests a playlist for the party theme.",
            instructions:
                "You are the DJ of Wayne Manor. You plan the music for events. " +
                "Use your tools and never invent their results. Answer in one or two sentences.",
            tools: [AIFunctionFactory.Create(PartyTools.SuggestPlaylist)])
        .WithTrace();


    private static AIAgent CreateDecorator(this IChatClient model)
        =>
        model.AsAIAgent(
            name: "Decorator",
            description: "Plans the music for an event: suggests a playlist for the party theme.",
            instructions:
                "You are the DJ of Wayne Manor. You plan the music for events. " +
                "Use your tools and never invent their results. Answer in one or two sentences.",
            tools: [AIFunctionFactory.Create(PartyTools.SuggestDecoration)])
        .WithTrace();

    
    private static AIAgent CreateAlfred(this IChatClient model, AIAgent chef, AIAgent dj, AIAgent decorator) 
        =>
        model.AsAIAgent(
            name: "Alfred",
            instructions:
                "You are Alfred, the butler of Wayne Manor. You organise events with the help of your team. " +
                "Ask the Chef about food and the DJ about music, then give the host one short summary.",
            tools: [chef.AsAIFunction(), dj.AsAIFunction()])
        .WithTrace();
}
