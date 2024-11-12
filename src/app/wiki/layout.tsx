import React from 'react';
import SideNav from '@/src/app/components/sidenav';
import Footer from '@/src/app/components/footer'; // Import the Footer component
import Header from '@/src/app/components/Header'; // Import the Header component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white"> {/* Apply the white background here */}
      <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}> {/* Flexbox layout */}
        <div className="w-full flex-none md:w-40">
        </div>
        <div className="flex-grow p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
