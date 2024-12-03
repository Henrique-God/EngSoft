'use client';

import { useEffect, useState } from 'react';
import { GetWikiHandler, GetAllTitlesHandler } from '@/src/app/components/conecctionBackendWiki';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import Link from 'next/link'; // Ensure Link is imported
import styles from './WikiPage.module.css'; // Import the CSS module

const WikiPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchTitles = async () => {
      const response = await GetAllTitlesHandler();
      if (response.success) {
        setTitles(response.titles || []);
      } else {
        console.error(response.error);
      }
    };

    fetchTitles();
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      const formattedTitle = slug.replace(/-/g, ' ');
      const response = await GetWikiHandler(formattedTitle);

      if (response.content) {
        setTitle(response.content.pageTitle);

        const processedContent = await unified()
          .use(remarkParse)
          .use(remarkHtml)
          .process(response.content.pageText);

        let updatedContent = processedContent.toString();
        titles.forEach((title) => {
          const formattedSlug = title.replace(/\s+/g, '-').toLowerCase();
          if (title.toLowerCase() !== formattedTitle.toLowerCase()) {
            const regex = new RegExp(`\\b${title.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}\\b`, 'gi');
            updatedContent = updatedContent.replace(regex, (match) => {
              return `<a href="/wiki/${formattedSlug}" class="${styles['title-link']}">${match}</a>`;
            });
          }
        });

        setContent(updatedContent);
      } else {
        setError(response.error || 'Erro ao carregar a página');
      }

      setLoading(false);
    };

    fetchPage();
  }, [slug, titles]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div
        className={styles['wiki-content']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default WikiPage;
