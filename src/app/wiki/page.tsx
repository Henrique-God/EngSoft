// src/app/wiki/page.tsx
import styles from './wiki.module.css';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';

const WikiIndex = async () => {
  const wikiDir = path.join(process.cwd(), 'src/assets/wiki');
  const filenames = fs.readdirSync(wikiDir);
  
  // Filtrar arquivos Markdown
  const markdownFiles = filenames.filter((file) => file.endsWith('.md'));


  return (
    <div className="wiki-index">
      <h1>Wiki Index</h1>
      <ul>
        {markdownFiles.map((filename) => {
          const slug = filename.replace(/\.md$/, '');
          return (
            <li key={slug}>
              <Link href={`/wiki/${slug}`}>
                {slug.replace(/-/g, ' ').toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>

    </div>
  );
};

export default WikiIndex;
