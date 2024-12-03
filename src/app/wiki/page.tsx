'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetAllTitlesHandler } from '@/src/app/components/conecctionBackendWiki';

const WikiIndex = () => {
  const [titles, setTitles] = useState<string[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await GetAllTitlesHandler();
        if (response.success && response.titles.length > 0) {
          setTitles(response.titles);
        } else {
          setTitles([]); // Ensure titles is set to an empty array
        }
      } catch (err) {
        console.error('Error fetching titles:', err);
        setError('Nenhuma página adicionada ainda');
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  return (
    <div className="wiki-index">
      <h1>Wiki Index</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : titles.length > 0 ? (
        <ul>
          {titles.map((title) => {
            const slug = title.replace(/\s+/g, '-').toLowerCase(); // Create URL slug
            console.log('Title:', title); // Log the exact title
            return (
              <li key={slug}>
                <Link href={`/wiki/${slug}`}>
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Nenhuma página adicionada ainda.</p>
      )}
    </div>
  );
};

export default WikiIndex;
