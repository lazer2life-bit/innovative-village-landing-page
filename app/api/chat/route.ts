import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are GramBudget Assistant, a helpful AI chatbot for the GramBudget platform — a smart village budget and expense management system for Indian Gram Panchayats.

You ONLY answer questions related to:
- GramBudget platform features: budget tracking, expense logging, reports, dashboards
- How to use the platform: signing up, logging in with Google or email, creating budgets, adding expenses, viewing live news
- Village finance concepts: Gram Panchayat budgets, government schemes (like MGNREGA, PM Awas Yojana, Swachh Bharat, Finance Commission grants), fund allocation, expenditure tracking, transparency, auditing
- General guidance on Indian village/Panchayat financial management and governance
- Technical help: how to navigate the dashboard, manage budget categories, filter expenses, check news

If someone asks a question that is NOT related to village finances, Gram Panchayat management, the GramBudget platform, or Indian government schemes, politely decline and redirect them to ask about GramBudget or village finance topics.

Keep responses concise, helpful, and friendly. Use Indian Rupee (INR) when discussing money. You may use simple formatting like bullet points for clarity.`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    if (
      message.includes("credit card") ||
      message.includes("customer_verification")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "AI Gateway requires a credit card on your Vercel account. Visit your Vercel dashboard > AI to add one and unlock free credits.",
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
