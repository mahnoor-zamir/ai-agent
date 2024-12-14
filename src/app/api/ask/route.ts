import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    const result = streamText({
      model: openai('gpt-4'),  // Changed from 'gpt-4-turbo' to 'gpt-4'
      messages: messages,
      system: "You are a helpful AI assistant for an email analytics dashboard. Provide concise and relevant answers to user queries.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in AI response:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

