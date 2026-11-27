using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Workflows;
using Microsoft.Extensions.AI;
using PartyPlanner;
using PartyPlanner.LLM;

/*
 * Tools
 * A tool is a function Alfred can ask the app to run.
 * For example, when you ask for a caterer, Alfred can use FindBestCatering
 * and use its result to answer you.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Sessions
 * A session holds the context for one conversation. If you say "plan for
 * 12 guests" and later ask "what about dessert?", reusing the session
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
 * Structured Output
 * An agent normally returns a response containing text.
 * Structured output lets us ask the agent to return data in a specific
 * C# type instead, such as an Rsvp record containing a guest's name
 * and whether they are attending the party.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Workflows
 * A workflow connects steps and defines how work moves from one step to the next.
 * For example, a party-planning workflow could find a caterer, ask for approval,
 * and place the order only if you approve.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Executors
 * An executor is a unit of work inside a workflow.
 * It receives an input, performs an operation, and can produce an output.
 * An executor can use an AI agent, a regular C# function, or other logic.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Edges
 * An edge connects one executor to another.
 * When an executor produces a result, an edge determines where that
 * result can go next.
 *
 * A conditional edge passes the result only when its condition is met.
 * For example, an attending guest goes to AddGuest, while a guest
 * who cannot attend goes to SendRegrets.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Workflow Events
 * During execution, a workflow produces events that describe what happened.
 * We can use these events to observe completed steps and retrieve
 * the final output of the workflow.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Multi-Agent Systems
 * Instead of giving one agent many different responsibilities,
 * we can create multiple specialized agents.
 *
 * For example, one agent reads an invitation reply, another reviews
 * the extracted information, and another writes a response.
 *
 * Each agent has its own instructions and responsibility.
 * Together, they can solve a larger task.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Sequential Orchestration
 * Sequential orchestration connects agents into an ordered pipeline.
 * Each agent performs its task before the next agent starts.
 *
 * For example:
 *
 * Reader -> Reviewer
 *
 * The Reader understands the invitation reply and the Reviewer
 * checks whether the information has been interpreted correctly.
 *
 * AgentWorkflowBuilder.BuildSequential creates this type of workflow
 * without requiring us to manually connect every agent using edges.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Workflow as an Agent
 * A workflow can be exposed through the standard AIAgent interface.
 *
 * The AsAIAgent method wraps a workflow so that callers can interact
 * with the entire team as if it were a single agent.
 *
 * The caller does not need to know how many agents are inside the team
 * or how those agents are connected.
 *
 * ---------------------------------------------------------------------------------------
 *
 * Workflow Composition
 * A workflow can coordinate functions that execute other workflows.
 *
 * This allows us to build larger systems from smaller, reusable
 * workflows, each responsible for a specific part of the task.
 *
 * For example, our main RSVP workflow can use a reading team,
 * a welcome team, and a regrets team.
 */


// =======================================================================================
// 1. MODEL
// =======================================================================================

// Create the local model once and reuse it across all agents.
//
// IChatClient is an abstraction for communicating with a language model.
// Multiple agents can share the same model while having different
// names, instructions, tools, and responsibilities.
IChatClient model = LocalModel.Create();


// =======================================================================================
// 2. AGENTS
// =======================================================================================

// The Reader is responsible for understanding invitation replies.
// It extracts the important information from natural language.
AIAgent reader = model.AsAIAgent(
    name: "Reader",
    instructions:
        "You read replies to a party invitation. " +
        "Identify the guest's name and whether they are coming. " +
        "Preserve the original reply and explain your interpretation. " +
        "Do not invent information.");


// The Reviewer checks the Reader's interpretation.
//
// Separating reading from reviewing gives a second agent the opportunity
// to detect mistakes before the information is used by the application.
AIAgent reviewer = model.AsAIAgent(
    name: "Reviewer",
    instructions:
        "You review the interpretation of a party invitation reply. " +
        "Check the guest's name and attendance status against the original reply. " +
        "Correct any mistakes you find. " +
        "Return the verified guest name and attendance status only.");


// The RsvpExtractor converts the reviewed information into structured data.
//
// Unlike the Reader and Reviewer, this agent will be called using
// RunAsync<Rsvp> so its result can be used directly by C# code.
AIAgent rsvpExtractor = model.AsAIAgent(
    name: "RsvpExtractor",
    instructions:
        "You convert verified invitation reply information into structured RSVP data. " +
        "Extract the guest's full name and whether the guest is attending. " +
        "Use true if the guest accepted the invitation and false if they declined.");


// The WelcomeWriter creates a personalized response for a guest
// who has accepted the invitation.
AIAgent welcomeWriter = model.AsAIAgent(
    name: "WelcomeWriter",
    instructions:
        "You are Alfred, the party planner at Wayne Manor. " +
        "Write a short and warm confirmation for a guest who accepted the invitation. " +
        "Address the guest by name. " +
        "Express that we look forward to seeing them. " +
        "Do not invent event details.");


// The RegretsWriter creates a polite response for a guest
// who cannot attend the party.
AIAgent regretsWriter = model.AsAIAgent(
    name: "RegretsWriter",
    instructions:
        "You are Alfred, the party planner at Wayne Manor. " +
        "Write a short and polite response to a guest who cannot attend. " +
        "Address the guest by name and express that they will be missed. " +
        "Do not make the guest feel guilty.");


// The Editor improves messages produced by other agents.
//
// This agent is reusable because its responsibility is not related
// to whether the guest accepted or declined the invitation.
AIAgent editor = model.AsAIAgent(
    name: "Editor",
    instructions:
        "You edit messages written by Alfred, the butler at Wayne Manor. " +
        "Make the message elegant, polite, professional, and concise. " +
        "Keep the original meaning and guest's name. " +
        "Do not add new facts. " +
        "Limit the response to two sentences. " +
        "Return the final message only.");


// =======================================================================================
// 3. SEQUENTIAL WORKFLOWS
// =======================================================================================

// Create a sequential workflow for reading invitation replies.
//
// Reader -> Reviewer
//
// The Reader runs first and its response is passed to the Reviewer.
// The Reviewer then checks and corrects the interpretation.
//
// chainOnlyAgentResponses makes each agent receive only the previous
// agent's output instead of the full accumulated conversation.
// The final workflow output contains the last agent's response.
//
// Because of this, the Reader is instructed to preserve the original reply.
Workflow readingPipeline = AgentWorkflowBuilder.BuildSequential(
    chainOnlyAgentResponses: true,
    agents: [reader, reviewer]);


// Expose the reading workflow as a single agent.
//
// Instead of manually running the Reader and then the Reviewer,
// we can now call readingTeam.RunAsync().
//
// The framework executes the agents in the correct order internally.
AIAgent readingTeam = readingPipeline.AsAIAgent(
    name: "ReadingTeam");


// Create another sequential workflow for guests who accepted.
//
// WelcomeWriter -> Editor
//
// The WelcomeWriter creates the first draft.
// The Editor improves the message before it is returned.
Workflow welcomePipeline = AgentWorkflowBuilder.BuildSequential(
    chainOnlyAgentResponses: true,
    agents: [welcomeWriter, editor]);

AIAgent welcomeTeam = welcomePipeline.AsAIAgent(
    name: "WelcomeTeam");


// Create a sequential workflow for guests who declined.
//
// RegretsWriter -> Editor
//
// Notice that we reuse the same Editor agent.
// We do not need to create a different editor for every workflow.
Workflow regretsPipeline = AgentWorkflowBuilder.BuildSequential(
    chainOnlyAgentResponses: true,
    agents: [regretsWriter, editor]);

AIAgent regretsTeam = regretsPipeline.AsAIAgent(
    name: "RegretsTeam");


// =======================================================================================
// 4. EXECUTOR FUNCTIONS
// =======================================================================================

// Define a function that receives an invitation reply as plain text
// and converts it into an Rsvp object.
//
// Unlike the previous implementation, this function now uses
// an entire team of agents to read and review the reply.
//
// Func<string, ValueTask<Rsvp>> describes a function that:
// - accepts a string as input;
// - asynchronously returns an Rsvp as output.
Func<string, ValueTask<Rsvp>> readReply = async reply =>
{
    // Run the entire ReadingTeam.
    //
    // Although we call RunAsync only once here, the workflow
    // internally executes both the Reader and Reviewer.
    AgentResponse reviewedReply = await readingTeam.RunAsync(reply);

    // Print the responses produced by the reading team.
    AgentLog.Print(reviewedReply);

    // Convert the reviewed information into a strongly typed Rsvp object.
    //
    // We use a separate agent for structured output so that we do not
    // depend on the workflow agent supporting structured output directly.
    AgentResponse<Rsvp> response =
        await rsvpExtractor.RunAsync<Rsvp>(reviewedReply.Text);

    return response.Result;
};


// Define a function that handles a guest who accepted the invitation.
//
// Previously, this was a synchronous function that returned
// a predefined string.
//
// Now it is asynchronous because it also calls a team of AI agents.
//
// Func<Rsvp, ValueTask<string>> describes a function that:
// - accepts an Rsvp object as input;
// - asynchronously returns a string as output.
Func<Rsvp, ValueTask<string>> addGuest = async rsvp =>
{
    // This represents application logic.
    // In a real application, we could save the guest to a database.
    // For this example, we only print a confirmation.
    AgentLog.Print($"  {rsvp.Guest} is on the guest list.");

    // Build the input for the WelcomeTeam using structured data.
    //
    // The agents do not need to interpret the original reply again.
    // They already know the guest's name and attendance status.
    string request =
        $"Guest: {rsvp.Guest}. " +
        "The guest accepted the party invitation. " +
        "Write a confirmation message.";

    // Run the entire WelcomeTeam.
    //
    // WelcomeWriter writes the message and Editor improves it.
    AgentResponse response = await welcomeTeam.RunAsync(request);

    AgentLog.Print(response);

    // Return the final message as the executor's output.
    return response.Text;
};


// Define a function that handles a guest who declined the invitation.
//
// This function follows the same pattern as addGuest,
// but uses a different team of agents.
Func<Rsvp, ValueTask<string>> sendRegrets = async rsvp =>
{
    // In a real application, we could update the guest list
    // and mark this guest as not attending.
    AgentLog.Print($"  {rsvp.Guest} will not attend the party.");

    string request =
        $"Guest: {rsvp.Guest}. " +
        "The guest declined the party invitation. " +
        "Write a polite response.";

    // Run the entire RegretsTeam.
    //
    // RegretsWriter writes the message and Editor improves it.
    AgentResponse response = await regretsTeam.RunAsync(request);

    AgentLog.Print(response);

    // Return the final message as the executor's output.
    return response.Text;
};


// =======================================================================================
// 5. EXECUTOR BINDINGS
// =======================================================================================

// Bind each function as an executor so it can participate
// in the main workflow.
//
// The main workflow does not need to know that these functions
// internally execute other workflows containing multiple agents.
//
// It only needs to know their input types, output types, and IDs.
ExecutorBinding read = readReply.BindAsExecutor("ReadReply");
ExecutorBinding welcome = addGuest.BindAsExecutor("AddGuest");
ExecutorBinding regrets = sendRegrets.BindAsExecutor("SendRegrets");


// =======================================================================================
// 6. MAIN WORKFLOW
// =======================================================================================

// Build the main workflow and define how its executors are connected.
//
// Unlike the sequential workflows created above, this workflow
// contains conditional edges.
//
// It is responsible for deciding which team should handle the guest
// based on the structured Rsvp data.
//
// The decision is made by C# code, not by an AI agent.
Workflow workflow = new WorkflowBuilder(read)

    // If the guest is attending, pass the Rsvp to AddGuest.
    //
    // AddGuest internally executes the WelcomeTeam.
    .AddEdge<Rsvp>(
        read,
        welcome,
        condition: rsvp => rsvp is { Attending: true })

    // If the guest is not attending, pass the Rsvp to SendRegrets.
    //
    // SendRegrets internally executes the RegretsTeam.
    .AddEdge<Rsvp>(
        read,
        regrets,
        condition: rsvp => rsvp is { Attending: false })

    // Both branches can produce the final workflow output.
    //
    // Only the branch whose condition is satisfied will execute.
    .WithOutputFrom(welcome, regrets)

    // Finish configuring the workflow.
    // Build does not execute any agents or executors.
    .Build();


// =======================================================================================
// 7. INPUT DATA
// =======================================================================================

// Prepare example replies to demonstrate both possible workflow paths.
//
// Selina accepts the invitation and Lucius declines it.
string[] replies =
[
    "Dear Alfred, thank you for the invitation. " +
    "I would be delighted to attend. Yours, Selina Kyle",

    "Alfred, sadly I am out of town that weekend and cannot make it. " +
    "Regards, Lucius Fox",
];


// =======================================================================================
// 8. WORKFLOW EXECUTION
// =======================================================================================

// Reuse the same workflow definition for each reply.
//
// Each reply starts a separate workflow execution.
// No conversation session is shared between different guests.
foreach (string reply in replies)
{
    AgentLog.Print(new string('=', 80));
    AgentLog.Print($"Reply: {reply}");
    AgentLog.Print();

    // Execute the main workflow locally, within the current process.
    //
    // The reply becomes the input of the starting executor, ReadReply.
    //
    // Run represents this particular workflow execution.
    // await using ensures that its resources are disposed of
    // asynchronously when we leave the current loop iteration.
    await using Run run =
        await InProcessExecution.RunAsync(workflow, reply);

    // Inspect the events produced by the main workflow.
    //
    // The internal agent responses are logged by AgentLog.Print
    // inside the executor functions.
    foreach (WorkflowEvent evt in run.NewEvents)
    {
        switch (evt)
        {
            // An executor in the main workflow has completed its work.
            //
            // Print its ID and associated event data so we can
            // observe the steps performed by the workflow.
            case ExecutorCompletedEvent step:
                AgentLog.Print($"  {step.ExecutorId} -> {step.Data}");
                break;

            // An executor has produced a workflow output.
            //
            // In this example, it is the personalized message
            // returned by either WelcomeTeam or RegretsTeam.
            case WorkflowOutputEvent output:
                AgentLog.Print();
                AgentLog.Print($"Result: {output.Data}");
                break;
        }
    }

    AgentLog.Print();
}


// =======================================================================================
// 9. DATA MODELS
// =======================================================================================

/*
 * Define the data structure that represents a reply to an invitation.
 *
 * Guest contains the guest's name.
 * Attending indicates whether the guest accepted the invitation.
 *
 * The RsvpExtractor agent uses this type as its structured output,
 * and the executors use it to exchange strongly typed data.
 *
 * The main workflow uses the Attending property to determine
 * which executor should receive the Rsvp object.
 */
public record Rsvp(string Guest, bool Attending);