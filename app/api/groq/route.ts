import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  userInput?: string;
  userBooks?: string[];
}

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const body: RequestBody = await req.json();
    const { userInput, userBooks = [] } = body;

    if (!userInput && userBooks.length === 0) {
      return NextResponse.json(
        { error: 'User input is required.' },
        { status: 400 }
      );
    }

    // ---- Prompt Construction ----
    let fullPrompt = '';
    if (userBooks.length > 0) {
      fullPrompt += `Here are books I’ve enjoyed: ${userBooks.join(', ')}.\n`;
    }
    if (userInput) {
      fullPrompt += `Additional preferences: ${userInput}\n`;
    }
    fullPrompt += `Based on this, recommend 5 new books I haven't read yet. Format your response ONLY as a valid JSON object like this:
{
  "books": [
    { "title": "Book Title 1", "author": "Author Name 1", "description": "A brief description of the book." },
    { "title": "Book Title 2", "author": "Author Name 2", "description": "Another brief description." }
  ]
}
Return ONLY the JSON and nothing else.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            "You are a helpful book recommender. Your task is to provide book recommendations based on user preferences, formatted strictly as a JSON object containing an array of books under the 'books' key.",
        },
        { role: 'user', content: fullPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error communicating with Groq API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during recommendation process.',
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
