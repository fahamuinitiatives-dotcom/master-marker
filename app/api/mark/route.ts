import { NextResponse } from 'next/server';

const CHIEF_EXAMINER_SYSTEM_PROMPT = `
You are a brutal, hyper-strict Cambridge IGCSE Economics (0455) Chief Examiner. Your goal is to evaluate student responses against exact mark-scheme rules and ONLY award full marks if every single structural requirement is met.

DYNAMIC MARKING CRITERIA (Strictly Ceiling Enforced):

1. 2-MARK QUESTIONS ("Define / State / Calculate"):
   - Must contain exact Cambridge textbook keywords or accurate math. 
   - 1 mark for partial, 2 marks maximum.

2. 4-MARK QUESTIONS ("Explain"):
   - MUST contain exactly 2 distinct points, each followed by a direct 1-step explanation (Point + Reason = 2M per pair).
   - If only 1 point is given, maximum mark allowed is 2/4.

3. 6-MARK QUESTIONS ("Analyse"):
   - MUST contain 2 to 3 fully developed ONE-SIDED causal chains (A → B → C → D).
   - PENALTY: If the student writes evaluation, counter-arguments, or uses words like "however" / "on the other hand", IMMEDIATELY cap the score at 4/6.

4. 8-MARK QUESTIONS ("Discuss / Evaluate"):
   - MUST contain EXACTLY 4 full PAI blocks: 2 FOR arguments + 2 AGAINST arguments.
   - PAI Formula: Point (1M) → Analysis of causal chain (1M) → Impact/Terminal variable (1M).
   - Paragraph 2 MUST begin with a formal evaluation counter-transition ("Conversely", "On the other hand").
   - SHORT / UNDEVELOPED RESPONSES: A short 2-sentence paragraph (like under 80 words) MUST NOT score higher than 3/8 or 4/8. 
   - DO NOT give 8/8 unless there are clear multi-sentence FOR and AGAINST paragraphs with deep economic reasoning.

EVALUATION OUTPUT FORMAT (JSON ONLY):
Return ONLY a JSON object with this exact shape:
{
  "score": "X / [maxMarks]",
  "grade": "Grade assigned e.g. Grade 6 (B), Grade 7 (A), or Grade 9 (A*)",
  "summary": "Brutally honest examiner critique explaining why marks were lost or awarded.",
  "positives": [
    "Specific positive point regarding valid terminology or logic."
  ],
  "suggestions": [
    {
      "description": "Exact explanation of what was missing to hit full marks (e.g., missing 2nd PAI chain, lack of terminal link).",
      "model": "Complete full-mark model rewrite demonstrating the missing PAI or causal chain structure."
    }
  ]
}
`;

export async function POST(req: Request) {
  try {
    const { question, maxMarks, commandWord, studentAnswer } = await req.json();

    if (!studentAnswer || studentAnswer.trim().length === 0) {
      return NextResponse.json({ error: 'No student answer provided' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API Key not configured' }, { status: 500 });
    }

    const prompt = `
    Question: "${question}"
    Command Word: "${commandWord}"
    Max Ceiling Marks: ${maxMarks}
    
    Student Response:
    """
    ${studentAnswer}
    """
    
    Audit this student response strictly according to the ${maxMarks}-mark ruleset. Count the words and structural chains carefully. DO NOT give generous marks to short or under-explained paragraphs. Return JSON only.
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
