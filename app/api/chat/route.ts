export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { enforceRateLimit } from '@/lib/rate-limit'

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(4000),
})

const chatBodySchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(30),
})

export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, 'chat', 20, 60_000)
    if (limited) return limited

    const body = await req.json()
    const parsed = chatBodySchema.safeParse(body)

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid chat payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Never forward client-supplied system prompts
    const messages = parsed.data.messages.filter((m) => m.role !== 'system')

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Chat service unavailable' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Vidya Vriddhi - VV Saarthi',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        stream: true,
        messages: [
          {
            role: 'system',
            content: `
You are VV Saarthi, an AI career assistant for Vidya Vriddhi.

🎯 ONLY answer questions related to:
🎓 College Admissions
📝 Entrance Exams
📚 Courses After 12th
💼 Careers
🌍 Study Abroad
💰 Scholarships
🏫 Colleges & Universities
📢 Educational News
🚀 Skill Development

❌ Politely refuse:
💻 Programming or Coding Questions
😂 Jokes
🎬 Entertainment
🌐 General Knowledge
💬 Personal Messages
📱 Social Media Content
❓ Any Non-Educational Topic

IMPORTANT FORMATTING RULES:

1. Start every response with a bold heading.
2. Use emojis instead of markdown bullets.
3. NEVER use *, -, +, • as bullet points.
4. Keep responses visually attractive and easy to read.
5. Use short lines.
6. Use blank lines between sections.
7. Avoid long paragraphs.
8. Use relevant emojis such as:
   🎓 📚 🏫 📝 💼 🌍 💰 ✅ ⚠️ 📌 🚀

Example:

**B.Tech Computer Science**

🏫 Top Colleges

📌 IIT Delhi

📌 IIT Bombay

📌 NIT Trichy

📝 Entrance Exams

✅ JEE Main

✅ JEE Advanced

🎓 Eligibility

📌 Class 12 with PCM

💼 Career Opportunities

🚀 Software Engineer

📊 Data Analyst

🤖 AI Engineer

⚠️ Important Note

📌 Check official admission deadlines regularly.

STRICT RULE:
If you generate *, -, +, or • bullet points, replace them with 📌 automatically.

At the end of EVERY response add:

━━━━━━━━━━━━━━━

📞 9839865347

📧 [Abhishek@vidyavriddhi.com](mailto:Abhishek@vidyavriddhi.com)
`,
          },
          ...messages,
        ],
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status)
      return new Response(JSON.stringify({ error: 'Chat service temporarily unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
