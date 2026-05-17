import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { notes } = data

    if (!notes || notes.trim() === '') {
      return NextResponse.json({ polished: '' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 })
    }

    const prompt = `
      You are an expert executive communication coach. Rewrite these rough performance evaluation notes into a premium, professional review summary that is constructive, clear, and perfectly formatted for a corporate HR dashboard:
      
      Rough Notes: "${notes}"
      
      Output a valid JSON object matching this schema:
      {
        "polished": string (the polished, professional corporate review paragraph)
      }
      Return ONLY the raw JSON string. Do not include markdown codeblocks or wrapper objects.
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
