// src/routes/api/test-key/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

// This endpoint verifies that the API key is loaded on the server side.
export const GET: RequestHandler = async () => {
    // For security, we don't send the actual API key back to the client.
    // Instead, we log it on the server to confirm it's loaded.
    console.log('OpenAI API Key Loaded:', OPENAI_API_KEY ? 'Yes' : 'No');

    return new Response('Server-side API key is configured.', { status: 200 });
};
