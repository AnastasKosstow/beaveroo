using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using PartyPlanner;
using PartyPlanner.Agents;
using PartyPlanner.LLM;
using PartyPlanner.Middlewares;
using PartyPlanner.Session;

/*
 * Tools
 * A tool is a function Alfred can ask the app to run.
 * For example, when you ask for a caterer, Alfred can use FindBestCatering
 * and use its result to answer you.
 * 
 * ---------------------------------------------------------------------------------------
 *
 * Sessions
 * A session holds the context for one conversation. If you say “plan for
 * 12 guests” and later ask "what about dessert?", reusing the session
 * lets Alfred use the earlier guest count.
 * 
 * ---------------------------------------------------------------------------------------
 *
 * Middleware
 * Middleware is code that runs around an agent run or an individual tool call.
 * It can measure how long Alfred takes or ask you to approve a catering order.
 * 
 * ---------------------------------------------------------------------------------------
 *
 * Workflows
 * A workflow connects steps and defines how work moves from one step to the next.
 * For example, a party-planning workflow could find a caterer, ask for approval,
 * and place the order only if you approve.
 */

const string SESSION_FILE = "session.json";

// Create an agent backed by the local model.
// Its instructions guide how it responds and when it uses tools.
var alfred = LocalModel.Create()
    .CreatePartyTeam()
    .AsBuilder()
    // Register middlewares for a whole turn.
    // runFunc handles RunAsync and returns the completed response.
    // runStreamingFunc handles RunStreamingAsync and yields updates as they arrive.
    // Passing null for runStreamingFunc makes a streaming call use runFunc too.
    // That means updates are available only after runFunc finishes.
    .Use(runFunc: AlfredMiddleware.MeasureRun, runStreamingFunc: null)
    .Use(runFunc: AlfredMiddleware.ProtectBatcave, runStreamingFunc: null)

    // AskBeforeOrdering can inspect which tool Alfred wants to call
    // and ask for approval when that tool is OrderCatering.
    // This Use overload takes one callback because the same tool-call
    // check applies whether the caller uses RunAsync or RunStreamingAsync.
    .Use(AlfredMiddleware.AskBeforeOrdering)
    .Build();

// Choose the session once, before the loop, so every turn shares it
AgentSession session;
if (File.Exists(SESSION_FILE))
{
    // Restore the conversation saved when the app last exited normally
    session = await SessionSerializer.LoadAsync(alfred, SESSION_FILE);
    Console.WriteLine("Last conversation loaded.");
}
else
{
    session = await alfred.CreateSessionAsync();
    Console.WriteLine("Ready.");
}

Console.WriteLine("Ask a question (or press Enter to exit).");

while (true)
{
    Console.Write("\nYou: ");
    string? input = Console.ReadLine();

    if (string.IsNullOrWhiteSpace(input))
    {
        break;
    }

    // RunAsync waits for Alfred to finish this turn, including any tool calls.
    // AgentLog then prints the completed response and its tool activity.
    AgentLog.Print(await alfred.RunAsync(input, session));

    // Alternative: replace the line above with this loop to print response text from each update.
    /*
       await foreach (var update in alfred.RunStreamingAsync(input, session))
       {
           Console.Write(update.Text);
       }
    */
}

// Save session on exit so the next launch can resume this conversation
await SessionSerializer.SaveAsync(alfred, session, SESSION_FILE);
