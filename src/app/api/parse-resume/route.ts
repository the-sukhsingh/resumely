import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse-new';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);

    const text = await data.text;

    return NextResponse.json({ text: data.text });
  } catch (error) {
    return NextResponse.json({ error: `Failed to parse PDF: ${error}` }, { status: 500 });
  }
}
