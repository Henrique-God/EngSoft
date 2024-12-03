'use client';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import wiki_pic from '@/src/assets/wiki.png';
import { GetAllTitlesHandler } from '@/src/app/components/conecctionBackendWiki';
import styles from './wiki.module.css'; // Import CSS module

const WikiIndex = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await GetAllTitlesHandler();
        if (response.success && response.titles.length > 0) {
          setTitles(response.titles);
        } else {
          setTitles([]);
          setError('Nenhuma página adicionada ainda.');
        }
      } catch (err) {
        console.error('Error fetching titles:', err);
        setError('Erro ao carregar os títulos.');
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Intro Section */}
        <div className={styles.intro}>
          <h2 className={styles.introHeading}>O que é a nossa Wiki?</h2>
          <p className={styles.introText}>
            Nossa Wiki foi criada para facilitar a navegação entre conteúdos relacionados ao combate à dengue e à
            conscientização sobre o mosquito *Aedes aegypti*. Aqui você encontra informações organizadas de maneira acessível,
            ajudando na disseminação de conhecimentos importantes para a saúde pública.
          </p>
          <p className={styles.introText}>
            Essa plataforma busca conectar pessoas interessadas em se informar e contribuir para uma comunidade mais saudável e
            consciente. Explore temas como prevenção, diagnóstico, sintomas e políticas de combate à dengue.
          </p>
          <Image src={wiki_pic} alt="Administrador" className={styles.introImage} />
          </div>

        {/* Index Section */}
        <div className={styles.index}>
          <h1 className={styles.heading}>Wiki Index</h1>
          {loading ? (
            <p className={styles.loading}>Carregando...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : titles.length > 0 ? (
            <ul className={styles.list}>
              {titles.map((title) => {
                const slug = title.replace(/\s+/g, '-').toLowerCase();
                return (
                  <li key={slug} className={styles.listItem}>
                    <Link href={`/wiki/${slug}`} className={styles.link}>
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.empty}>Nenhuma página adicionada ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WikiIndex;
