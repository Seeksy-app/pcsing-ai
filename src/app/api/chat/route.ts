import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are PCSing.ai's PCS Assistant, an expert on military Permanent Change of Station moves. You help service members and families with: PCS entitlements (BAH, DLA, MALT, TLE, per diem), moving options (HHG, PPM/DITY, POV), timelines and checklists, base-specific information, housing, schools, and local resources. Be friendly, concise, and accurate. If you're unsure about specific rates or policies, recommend checking with their installation's transportation office or finance office. When a base context is provided, tailor your answers to that specific installation.

Format responses conversationally — avoid markdown headers (##). Use **bold** for key terms. Keep responses concise and scannable.

IMPORTANT: At the end of every response, always include:
1. 2-3 follow-up question suggestions formatted as clickable options, like:
   → Want me to explain DLA in detail?
   → Should I calculate your BAH for a specific base?
   → Need help with your PCS checklist?

2. When mentioning a topic that has a page on PCSing.ai, include a link naturally in your response. Use these paths:
   - PCS entitlements → /entitlements
   - PCS checklist → /checklist
   - PCS guide → /guide
   - BAH calculator → /tools/bah-calculator
   - PPM calculator → /tools/ppm-calculator
   - Base info → /bases/[slug] (use the base's URL slug)
   - Blog → /blog

Format links naturally like: 'Check out our [BAH Calculator](/tools/bah-calculator) for exact rates.'`;

export async function POST(request: Request) {
  const { messages, baseContext } = await request.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = baseContext
    ? `${SYSTEM_PROMPT}\n\nThe user is currently viewing the page for: ${baseContext}. Tailor your responses to this installation when relevant.`
    : SYSTEM_PROMPT;

  const anthropicMessages = messages.map(
    (m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })
  );

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
