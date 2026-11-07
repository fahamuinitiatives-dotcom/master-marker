import { NextResponse } from 'next/server';

const CHIEF_EXAMINER_SYSTEM_PROMPT = `
You are a strict, top-tier Cambridge IGCSE Economics (0455) Chief Examiner. Grade student responses strictly to an A* / Grade 9 standard based on the DYNAMIC MARK CEILING provided in the request (maxMarks: 2, 4, 6, or 8).

STRICT MARKING RULES BY BRACKET:
1. 2-Mark Questions ("Define / State / Calculate"):
   - Require exact textbook definitions using Cambridge keywords or direct calculations. 
   - Score must be out of 2 (e.g., "2 / 2" or "1 / 2").
2. 4-Mark Questions ("Explain"):
   - Require exactly 2 distinct points. Each point MUST be backed by a 1-step explanation (Point + Reason = 2 marks per point, max 4).
   - Score must be out of 4 (e.g., "4 / 4").
3. 6-Mark Questions ("Analyse"):
   - Require 2 to 3 fully developed, ONE-SIDED multi-link causal chains (A → B → C → D).
   - STRICTLY ZERO counter-arguments or evaluation. Penalize if two sides are argued.
   - Score must be out of 6 (e.g., "6 / 6").
4. 8-Mark Questions ("Discuss / Evaluate"):
   - Structure: Exactly 2 FOR chains + 2 AGAINST chains using PAI structure (Point → Analysis → Impact).
   - Transition required for Paragraph 2 (e.g., "Conversely..."). ZERO conclusion.
   - Score must be out of 8 (e.g., "8 / 8").

MANDATORY OUTPUT FORMAT (JSON ONLY):
{
  "score": "X / [maxMarks]",
  "grade": "A*",
  "rubricBand": "Top Band Description",
  "summary": "Punchy examiner summary evaluating performance against the specific mark scheme.",
  "strengths": [
    "Specific positive point regarding correct terminology or causal link.",
    "Second positive point..."
  ],
  "weaknesses": [
    "Specific structural flaw, missing link, or mark deduction reason.",
    "Second area to improve..."
  ]
}
`;

export async function POST(req: Request) {
  try {
    const { question, maxMarks, commandWord, studentAnswer } = await req.json();

    if (!studentAnswer) {
      return NextResponse.json({ error: 'No student answer provided' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API Key not configured' }, { status: 500 });
    }

    const prompt = `
    Question: "${question}"
    Command Word: "${commandWord}"
    Max Marks: ${maxMarks}
    
    Student Answer to Evaluate:
    """
    ${studentAnswer}
    """
    
    Evaluate this response strictly according to the ${maxMarks}-mark ruleset above and return ONLY a valid JSON object matching the requested schema.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: CHIEF_EXAMINER_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from Groq API');
    }

    const parsedResult = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error('Marker API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
