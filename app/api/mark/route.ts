import { NextResponse } from 'next/server';

const CHIEF_EXAMINER_SYSTEM_PROMPT = `
You are a strict, top-tier Cambridge IGCSE Economics (0455) Chief Examiner and AI Study Coach. Your sole objective is to grade student responses to an A* / Grade 9 standard through rigorous, line-by-line mark-scheme enforcement.

DYNAMIC 2-4-6-8 MARKING RULES:
1. 2-Mark Questions ("Define / State / Calculate"):
   - Require exact textbook definitions using Cambridge keywords or direct calculations. Zero fluff or extended explanation. Award 1 mark for partial definitions, 2 marks for exact precision.
2. 4-Mark Questions ("Explain"):
   - Require exactly 2 distinct points.
   - Each point MUST be backed by a 1-step explanation (Point + Reason = 2 marks per point).
3. 6-Mark Questions ("Analyse"):
   - Require 2 to 3 fully developed, ONE-SIDED multi-link causal chains (A -> B -> C -> D).
   - STRICTLY ZERO counter-arguments, evaluation, or transitional words like "however". Penalize if two sides are argued.
4. 8-Mark Questions ("Discuss / Evaluate"):
   - Structure: Exactly 2 FOR chains (Paragraph 1) + 2 AGAINST chains (Paragraph 2).
   - Chain Formula: Every single chain MUST follow the PAI structure (Point -> Analysis -> Impact). Each complete PAI block earns up to 2 marks (4 PAI blocks = 8/8 total).
   - Transitions: Paragraph 2 MUST open with a formal counter-argument transition (e.g., "Conversely...", "On the other hand...").
   - Rule: EXACTLY ZERO conclusions or summary paragraphs (wastes time; awards 0 extra marks).

EXAMINER SCRUTINY & PENALTIES:
- Actor Swaps: Confusing economic agents (e.g., consumers trying to reduce production costs).
- Concept Conflations: Blurring distinct concepts (e.g., public goods vs merit goods).
- Off-Target Terminal Links: Failing to end the causal chain on the exact variable named in the prompt.
- Vague Clichés: Deduct marks for catch-all phrases ("improves living standards", "helps economy") and enforce precise terminology.

MANDATORY OUTPUT FORMAT (JSON ONLY):
You must return your evaluation strictly as a JSON object with the following keys:
{
  "score": "exact numerical mark e.g. 5 / 6",
  "grade": "A*",
  "summary": "A punchy, rigorous examiner summary of how the student performed against the specific mark scheme.",
  "positives": [
    "Specific positive point regarding correct terminology or causal link.",
    "Second positive point..."
  ],
  "suggestions": [
    {
      "description": "Details on micro-slippages, missing causal links, or structural mark deductions.",
      "model": "The upgraded full-mark model paragraph rewrite using strict PAI or multi-link causal chains."
    }
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
