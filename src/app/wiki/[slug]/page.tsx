'use client';

import { useEffect, useState } from 'react';
import { GetWikiHandler } from '@/src/app/components/conecctionBackendWiki';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const WikiPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      // Log the received slug to check if it's being passed correctly
      console.log('Received slug:', slug);

      // Convert the slug back to the original title
      const formattedTitle = slug.replace(/-/g, ' '); // Convert slug back to title
      console.log('Formatted title for search:', formattedTitle); // Log the formatted title

      const response = await GetWikiHandler(formattedTitle);

      if (response.content) {
        console.log('Response content:', response.content); // Log the response from the API
        setTitle(response.content.pageTitle);

        // Process the Markdown content to HTML
        const processedContent = await unified()
          .use(remarkParse)
          .use(remarkHtml)
          .process(response.content.pageText);

        setContent(processedContent.toString());
      } else {
        setError(response.error || 'Erro ao carregar a página');
      }

      setLoading(false);
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="wiki-page">
      <div
        className="wiki-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default WikiPage;
