using Microsoft.Extensions.AI;
using OllamaSharp;
using OllamaSharp.Models;

namespace PartyPlanner.LLM;

public static class LocalModel
{
    private const string Model = "qwen3.5:9b";

    public static IChatClient Create()
    {
        var http = new HttpClient
        {
            BaseAddress = new Uri("http://localhost:11434"),
            Timeout = TimeSpan.FromMinutes(5),
        };

        return new ChatClientBuilder(new OllamaApiClient(http, Model))
            .ConfigureOptions(options =>
            {
                options.Temperature = 0; // the model always picks the most likely token
                options.AddOllamaOption(OllamaOption.Think, false); //  turns off the mode in which the model "thinks out loud"
            })
            .Build();
    }
}
