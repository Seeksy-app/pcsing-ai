import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { messages } = await request.json();

  // Placeholder — replace with actual AI API call (e.g. Anthropic Claude)
  const lastMessage = messages[messages.length - 1]?.content || "";

  return NextResponse.json({
    reply: `I received your question: "${lastMessage}". The AI chat integration will be connected soon. In the meantime, check out our PCS Guide and Checklist pages for helpful information!`,
  });
}
