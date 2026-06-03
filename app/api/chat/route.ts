export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), { status: 500 })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Vidya Vriddhi - VV Saarthi',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        stream: true,
        messages: [
          {
            role: 'system',
            content: 'You are VV Saarthi, an AI career assistant for Vidya Vriddhi. ONLY answer queries related to education after 12th — college admissions, exams, courses, study abroad, careers, educational news. Politely refuse anything else (messages, jokes, code, general knowledge).\n\nCRITICAL formatting rules - follow EXACTLY:\n1. Start with **bold heading** on its own line\n2. Every bullet MUST start with * and be on its OWN separate line\n3. NEVER put multiple * bullets on the same line\n4. Keep each bullet short and clear\n5. Use blank lines between sections\n6. NO paragraphs, NO walls of text\n\nCorrect format:\n**Heading**\n* First point here\n* Second point here\n* Third point here\n\nAt the end of EVERY response, add this contact info on separate lines:\n📞 9839865347\n📧 Abhishek@vidyavriddhi.com',
          },
          ...messages,
        ],
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return new Response(JSON.stringify({ error: `OpenRouter API error: ${error}` }), { status: response.status })
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
