using System.ComponentModel;

namespace PartyPlanner.Tools;

public static class PartyTools
{
    [Description("Suggests a menu for a given type of occasion.")]
    public static string SuggestMenu(
        [Description("The type of occasion. Allowed values: 'casual', 'formal', 'superhero'.")]
        string occasion) 
            => 
            occasion.ToLowerInvariant() switch
            {
                "casual" => "Pizza, snacks and drinks.",
                "formal" => "Three-course dinner with wine and dessert.",
                "superhero" => "Buffet with high-energy and healthy food.",
                _ => $"Unknown occasion '{occasion}'. Allowed values: 'casual', 'formal', 'superhero'.",
            };


    [Description("Returns the highest-rated catering service in Gotham City.")]
    public static string FindBestCatering()
    {
        Dictionary<string, int> ratings = new()
        {
            ["Gotham Catering Co."] = 98,
            ["Wayne Manor Catering"] = 96,
            ["Gotham City Events"] = 94,
        };

        var best = ratings.MaxBy(rating => rating.Value);

        return $"{best.Key} (rating {best.Value}/100)";
    }

    [Description("Places a catering order. This spends real money.")]
    public static string OrderCatering(
    [Description("The name of the catering service.")] string service,
    [Description("The number of guests.")] int guests) 
        =>
        $"Order placed with {service} for {guests} guests.";


    [Description("Suggests a playlist for a given party theme.")]
    public static string SuggestPlaylist(
    [Description("The party theme. Allowed values: 'classic heroes', 'villain masquerade', 'futuristic gotham'.")]
    string theme) => theme.ToLowerInvariant() switch
    {
        "classic heroes" => "Orchestral film scores with triumphant brass.",
        "villain masquerade" => "Dark tango, cabaret and mysterious waltzes.",
        "futuristic gotham" => "Synthwave and neon electronic beats.",
        _ => $"Unknown theme '{theme}'. Allowed values: 'classic heroes', 'villain masquerade', 'futuristic gotham'.",
    };
}
