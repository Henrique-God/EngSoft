// src/app/api/wiki/index/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const wikiDir = path.join(process.cwd(), 'assets/wiki');
    const filenames = fs.readdirSync(wikiDir);

    // Filtra os arquivos Markdown
    const markdownFiles = filenames.filter(file => file.endsWith('.md'));

    return NextResponse.json(markdownFiles);
  } catch (error) {
    console.error('Erro ao ler arquivos de wiki:', error);
    return NextResponse.json({ message: 'Erro ao ler arquivos da wiki.' }, { status: 500 });
  }
}
