import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { title, description } = data

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    const prompt = `
      You are an expert HR Performance Coach. Analyze the following goal and evaluate it based on the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound).
      
      Goal Title: "${title || ''}"
      Goal Description: "${description || ''}"
      
      Analyze the goal and output a valid JSON object matching this schema:
      {
        "score": number (between 0 and 100 representing SMART compliance),
        "feedback": string[] (list of 2-3 short feedback items, e.g. "✓ Measurable metric found." or "⚠ Missing a specific timeframe."),
        "alignment": string (a short 1-sentence encouraging appraisal),
        "suggestion": string (a perfect, rewritten SMART version of this goal combining title and description, using placeholder metrics like [Metric] or [X]% if needed)
      }
      Return ONLY the raw JSON string. Do not include markdown codeblocks or wrapper objects.
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: `Gemini API returned error: ${errText}` }, { status: response.status })
    }

    const responseData = await response.json()
    const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      return NextResponse.json({ error: 'Empty response from Gemini API' }, { status: 500 })
    }

    const parsedResult = JSON.parse(responseText.trim())
    return NextResponse.json(parsedResult)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
