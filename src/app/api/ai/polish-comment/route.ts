import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  const { notes } = data

  await new Promise((resolve) => setTimeout(resolve, 1500)) // AI delay

  if (!notes || notes.trim() === '') {
    return NextResponse.json({ polished: '' })
  }

  // Simulate a polished professional version of rough notes
  let polished = notes.trim()
  
  if (polished.length < 20) {
    polished = `I have reviewed the progress and note that ${notes.toLowerCase()}. Please ensure we stay focused on the key deliverables for the remainder of the quarter.`
  } else {
    // Just a mock wrapper to make it sound professional
    polished = `Progress Review: Based on the current trajectory, it is evident that the team is making strides. Specifically regarding your notes ("${notes}"), I appreciate the effort and encourage continued alignment with our core thrust areas. Let's touch base on any blockers.`
  }

  return NextResponse.json({
    polished
  })
}
