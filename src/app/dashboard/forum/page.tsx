"use client";

import { useState } from 'react';
import { josefinSans } from '@/src/app/fonts/fonts'; // Importando a fonte
import styles from './forum.module.css'; // Importando o arquivo CSS

export default function DengueForum() {
  const [posts, setPosts] = useState([
    { id: 1, user: 'Ana', title: 'O que é dengue?', content: 'Dengue é uma doença viral transmitida pelo mosquito Aedes aegypti.' },
    { id: 2, user: 'Carlos', title: 'Como prevenir?', content: 'É importante não deixar água parada e usar repelente.' }
  ]);

  const [newPost, setNewPost] = useState({ user: '', title: '', content: '' });

  const addPost = (e) => {
    e.preventDefault();
    if (newPost.user && newPost.title && newPost.content) {
      const updatedPosts = [...posts, { ...newPost, id: posts.length + 1 }];
      setPosts(updatedPosts);
      console.log(updatedPosts);
      setNewPost({ user: '', title: '', content: '' });
    } else {
      console.error("Todos os campos devem ser preenchidos.");
    }
  };

  return (
    <div className={styles.container} style={{ fontFamily: josefinSans.style.fontFamily }}> {/* Aplicando a fonte diretamente */}
      <h1 className={styles.title}>Fórum sobre Dengue</h1>
      <p>Aqui você pode discutir e compartilhar informações sobre a dengue, prevenção e tratamento.</p>

      <div>
        <h2 className={styles.subtitle}>Postagens</h2>
        
        {posts.length === 0 ? (
          <p>Nenhuma postagem disponível.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <h3 className={styles['post-title']}>{post.title}</h3>
              <p className={styles['post-user']}>Usuário: {post.user}</p>
              <p className={styles['post-content']}>{post.content}</p>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 className={styles.subtitle}>Criar Nova Postagem</h2>
        <form onSubmit={addPost} className={styles.form}>
          <div>
            <label htmlFor="user" className={styles['form-label']}>Usuário:</label>
            <input
              type="text"
              id="user"
              className={styles.input}
              value={newPost.user}
              onChange={(e) => setNewPost({ ...newPost, user: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="title" className={styles['form-label']}>Título:</label>
            <input
              type="text"
              id="title"
              className={styles.input}
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className={styles['form-label']}>Conteúdo:</label>
            <textarea
              id="content"
              className={styles.textarea}
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.button}>Postar</button>
        </form>
      </div>
    </div>
  );
}
