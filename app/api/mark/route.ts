import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { subject, question, answer } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key is not configured.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert Cambridge IGCSE examiner for subject syllabus code ${subject}. 
Evaluate the student's answer strictly against official Cambridge assessment objectives, mark schemes, and terminology.
Provide a clear breakdown with:
1. Marks awarded out of the typical maximum for such a question.
2. Strengths of the answer.
3. Specific areas for improvement or missing key terms required for full marks.`;

    const userPrompt = `Question: ${question}\n\nStudent Answer: ${answer}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to communicate with Claude API' },
        { status: response.status }
      );
    }

    const feedbackText = data.content[0]?.text || 'No feedback generated.';

    return NextResponse.json({ feedback: feedbackText });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
