import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a PCS assistant for military families. Be direct and concise — 2-3 sentences max unless providing specific data like BAH rates, school lists, or checklists. Never explain what you can do — just do it. Ask one question at a time if you need info. No bullet lists of questions. Speak like an experienced military spouse: friendly, efficient, no fluff. Always provide specific, actionable information. If you know the base, lead with the answer.

Rules:
- Max 3 sentences per response unless giving specific data (rates, lists, steps).
- If you need the base name, just say: "Which base are you PCSing to?" — one line, nothing else.
- Never lecture or list what info you need. Ask one thing at a time.
- No "I think there might be a small mix-up" or similar hedging. Answer directly.
- Avoid markdown headers (##). Use **bold** for key terms only.

When mentioning a PCSing.us page, link it naturally:
- PCS entitlements → /entitlements
- PCS checklist → /checklist
- PCS guide → /guide
- BAH calculator → /tools/bah-calculator
- PPM calculator → /tools/ppm-calculator
- Blog → /blog
Do NOT link to individual base pages (/bases/[slug]). Answer base questions directly.

At the end of every response, include 2-3 follow-up suggestions as short action phrases the USER would click. Format each on its own line starting with →. These must be direct actions, NOT questions directed at the user.

GOOD follow-up examples:
→ Calculate my BAH
→ Fort Liberty schools
→ PCS checklist
→ Compare housing options
→ DLA breakdown
→ DITY move steps

BAD follow-up examples (never do these):
→ Would you like me to explain DLA?
→ Need help with your checklist?
→ Which base are you headed to?
→ Want to know about housing options?`;

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
    ? `${SYSTEM_PROMPT}\n\nThe user is asking about ${baseContext}. They already selected this base — do NOT ask which base. Answer directly about ${baseContext}.`
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
