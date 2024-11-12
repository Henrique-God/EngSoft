// app/api/wiki/create/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    
    // Formata o título para ser o nome do arquivo
    const fileName = title.replace(/\s+/g, '_').toLowerCase() + '.md';
    const filePath = path.join(process.cwd(), 'assets/wiki', fileName);

    // Cria o diretório caso não exista
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Escreve o conteúdo no arquivo
    fs.writeFileSync(filePath, content, 'utf8');

    return NextResponse.json({ message: 'Página criada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar página:', error);
    return NextResponse.json({ message: 'Erro ao criar página.' }, { status: 500 });
  }
}
