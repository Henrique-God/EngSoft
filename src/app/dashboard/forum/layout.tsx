import React from 'react';
import SideNav from '@/src/app/components/sidenav';
import Footer from '@/src/app/components/footer'; // Import the Footer component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white"> {/* Aplicar o fundo branco aqui */}
      <div className="flex flex-grow md:flex-row">
        <div className="w-full flex-none md:w-40">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:p-12">
          {children}
        </div>
      </div>
      <Footer /> {/* O Footer está no final, mas não é fixo */}
    </div>
  );
}
