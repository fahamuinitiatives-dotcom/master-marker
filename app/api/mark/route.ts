import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { subject, question, answer } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key is not configured in Vercel.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert Cambridge IGCSE examiner for subject syllabus code ${subject}. 
Evaluate the student's answer strictly against official Cambridge assessment objectives, mark schemes, and terminology.

Provide a clear, well-formatted breakdown with:
1. Marks Awarded: (e.g. 5/6 marks)
2. Key Strengths: What the student did correctly.
3. Areas for Improvement: Specific missing key terms, concepts, or logical links needed for full marks.
4. Model Candidate Answer: Rephrase and elevate the student's original answer into a polished, full-mark candidate response using exact Cambridge mark-scheme terminology.`;

    const userPrompt = `Question: ${question}\n\nStudent Answer: ${answer}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to communicate with Groq API' },
        { status: response.status }
      );
    }

    const feedbackText = data.choices[0]?.message?.content || 'No feedback generated.';

    return NextResponse.json({ feedback: feedbackText });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
