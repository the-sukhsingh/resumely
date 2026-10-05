import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse-new';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided. Please select a PDF file to upload.' }, { status: 400 });
    }

    // Check file extension and MIME type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file format. Resumely only supports PDF files (.pdf).' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify PDF magic bytes (%PDF-)
    if (buffer.length < 5 || buffer.toString('utf8', 0, 5) !== '%PDF-') {
      return NextResponse.json({ error: 'The uploaded file is not a valid PDF document. Please upload an authentic PDF resume.' }, { status: 400 });
    }

    const data = await pdf(buffer);
    const extractedText = (data.text || '').trim();

    if (extractedText.length < 50) {
      return NextResponse.json({
        error: 'The uploaded PDF does not contain sufficient readable text. Scanned or image-only PDFs without an OCR text layer cannot be parsed. Please upload a PDF with selectable text.'
      }, { status: 422 });
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Failed to parse PDF: ${message}` }, { status: 500 });
  }
}
