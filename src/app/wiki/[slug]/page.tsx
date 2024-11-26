// app/wiki/[slug]/page.tsx

import path from 'path';
import fs from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

// Esta função gera os parâmetros estáticos para cada arquivo Markdown
export async function generateStaticParams() {
  const wikiDir = path.join(process.cwd(), 'src/assets/wiki');
  const filenames = fs.readdirSync(wikiDir);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''), // Remove .md para criar slug
  }));
}

// Página que exibe o conteúdo do Markdown
const WikiPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/assets/wiki', `${slug}.md`);

  // Verifica se o arquivo existe antes de ler
  if (!fs.existsSync(filePath)) {
    return <div>Página não encontrada</div>; // Trata arquivo não encontrado
  }

  // Lê e processa o arquivo Markdown
  const content = fs.readFileSync(filePath, 'utf-8');
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  const htmlContent = processedContent.toString();

  return (
    <div className="wiki-page">
      <h1>{slug.replace(/-/g, ' ').toUpperCase()}</h1>
      <div
        className="wiki-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default WikiPage;
