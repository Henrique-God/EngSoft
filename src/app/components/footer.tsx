import React from 'react';
import styles from './footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Importing icons for social media

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerWrapper}>
        <div className={styles.container}>
          
          {/* Column for Social Media */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Siga-nos</h4>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.icon}>
                <FaFacebookF size={20} />
              </a>
              <a href="#" className={styles.icon}>
                <FaTwitter size={20} />
              </a>
              <a href="#" className={styles.icon}>
                <FaInstagram size={20} />
              </a>
              <a href="#" className={styles.icon}>
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

          {/* Column for Project Team */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Responsáveis pelo Projeto</h4>
            <p className={styles.text}>Helena Moyen</p>
            <p className={styles.text}>Henrique Godoy</p>
            <p className={styles.text}>Gabriel Pereira</p>
            <p className={styles.text}>Gabriel Vilas</p>
          </div>
          
          {/* Column for Project Information */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Sobre o Projeto</h4>
            <p className={styles.text}>Tchau Dengue</p>
            <a href="#" className={styles.link}>Saiba Mais</a><br />
            <a href="#" className={styles.link}>FAQ</a><br />
            <a href="#" className={styles.link}>Informações Gerais</a><br />
            <a href="#" className={styles.link}>Documentação</a>
          </div>

        </div>
      </div>
      
      {/* Copyright Notice */}
      <div className={styles.copyright}>
        <p>&copy; 2024 Projeto de Combate à Dengue. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
