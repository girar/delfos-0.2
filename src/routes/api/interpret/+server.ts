// src/routes/api/interpret/+server.ts
// ✅ import json as a value, RequestHandler as a type
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
// ✅ import OPENAI_API_KEY from environment variables
import { OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai';

// Create a configuration object using the secure API key.
const configuration = new Configuration({
	apiKey: OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Refined system prompt with explicit instructions for column naming.
const systemPrompt = `
You are an ancient Tarot Oracle. Your sole purpose is to symbolically interpret the meaning of Tarot cards provided in the reading. The user will make a question and give you two tarot card names in three stages called „Situation“, „Obstacle“ and „Outcome“, After receiving interpretations for all three stages, provide a concise final summary that integrates the insights of all stages without re-listing the card names. Speak with elegance, metaphor, and in a ritualistic tone but be concise. Do not reference any tarot cards that are not explicitly mentioned in the input for each stage. Remain in character at all times.
`;

/**
 * Build the user message from the request body.
 * For final synthesis, we assume the client supplies the complete combined prompt in userPrompt.
 * Otherwise, we build a message for a single column interpretation.
 */
function buildUserMessage(body: any): string {
  if (body.type === 'final') {
    // For final synthesis, the client should send the entire combined query.
    return body.userPrompt;
  }
  if (body.columnIndex === undefined || !Array.isArray(body.cardNames)) {
    throw new Error('Invalid request: missing columnIndex or cardNames');
  }
  // Use provided columnName if available; otherwise, fallback.
  const colName = body.columnName || `Column ${body.columnIndex + 1}`;
  return `User theme: ${body.userPrompt}\nCards in ${colName}: ${body.cardNames.join(', ')}`;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the JSON input from the client.
    const body = await request.json();

    if (!body.userPrompt) {
      return new Response(JSON.stringify({ error: 'Missing userPrompt' }), { status: 400 });
    }

    // Build the message string based on the request type.
    const userMessage = buildUserMessage(body);

    // Use more tokens for final synthesis.
    const maxTokens = body.type === 'final' ? 300 : 150;

    // Call the OpenAIApi to generate the interpretation.
    const completionResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    });

    // early‑return a placeholder when no key present
    if (!import.meta.env.OPENAI_API_KEY) {
      return json({ interpretation: '🔮 Demo build – no API key set.' });
    }

    // Extract the generated interpretation.
    const interpretation = completionResponse.data.choices[0]?.message?.content?.trim();
    if (!interpretation) {
      return new Response(JSON.stringify({ error: 'No interpretation generated.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ interpretation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in /api/interpret:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
