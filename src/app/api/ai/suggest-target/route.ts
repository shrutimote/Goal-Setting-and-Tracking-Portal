import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { thrustArea, title } = data

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    const prompt = `
      You are an expert enterprise metrics consultant. Suggest a highly realistic, industry-standard Unit of Measure (UoM) and Target for the following corporate objective:
      
      Thrust Area: "${thrustArea || ''}"
      Objective Title: "${title || ''}"
      
      Output a valid JSON object matching this schema:
      {
        "suggestedTarget": string (a realistic target value, e.g. "98" or "250000" or a date "2026-06-30" or "1"),
        "suggestedUom": string (MUST be exactly one of: "Numeric", "Percent", "Timeline", "Zero-Based"),
        "reasoning": string (a short 1-sentence explanation of why this target is standard and how to achieve it)
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
