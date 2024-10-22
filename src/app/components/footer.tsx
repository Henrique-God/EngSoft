import React from 'react';
import { josefinSans } from '@/src/app/fonts/fonts'; // Importing the font
import styles from './footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Importing icons for social media

const Footer = () => {
  return (
    <footer className={`bg-white text-black py-4 border-t border-gray-300 ${josefinSans.className}`}>
      <div className={styles.footerWrapper}>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 text-center">
          
          {/* Column for Project Team */}
          <div className="p-4">
            <h4 className="font-bold text-base mb-1">Responsáveis pelo Projeto</h4>
            <p className="text-sm">Helena Moyen</p>
            <p className="text-sm">Henrique Godoy</p>
            <p className="text-sm">Gabriel Pereira</p>
            <p className="text-sm">Gabriel Vilas</p>
          </div>
          
          {/* Column for Project Information */}
          <div className="p-4">
            <h4 className="font-bold text-base mb-1">Sobre o Projeto</h4>
            <p className="text-sm mb-2">Nome do Projeto: Projeto de Drones Autônomos</p>
            <a href="#" className="text-blue-600 text-xs hover:underline">Saiba Mais</a><br />
            <a href="#" className="text-blue-600 text-xs hover:underline">FAQ</a><br />
            <a href="#" className="text-blue-600 text-xs hover:underline">Informações Gerais</a><br />
            <a href="#" className="text-blue-600 text-xs hover:underline">Documentação</a>
          </div>
          
          {/* Column for Social Media */}
          <div className="p-4">
            <h4 className="font-bold text-base mb-1">Siga-nos</h4>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-blue-600">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-blue-400">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-pink-500">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-blue-700">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

        </div>
        
      </div>
      <div className="text-center mt-4">
          <p className="text-xs text-gray-500">&copy; 2024 Projeto de Combate à Dengue. Todos os direitos reservados.</p>
        </div>
    </footer>
  );
};

export default Footer;
