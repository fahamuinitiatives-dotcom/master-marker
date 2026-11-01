import { Document, Packer, Paragraph, TextRun } from 'docx';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { rewrittenAnswer } = await req.json();
  const doc = new Document({
    sections: [{ properties: {}, children: [
      new Paragraph({ children: [new TextRun({ text: "Improved Answer (IGCSE Marker)", bold: true, size: 32 })] }),
      new Paragraph({ text: rewrittenAnswer, spacing: { before: 400 } })
    ]}]
  });
  const b64string = await Packer.toBase64String(doc);
  return NextResponse.json({ file: b64string });
}