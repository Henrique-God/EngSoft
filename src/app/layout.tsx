import { Metadata } from "next";
import "./globals.css"; 
import dynamic from "next/dynamic";
import SideNav from "@/src/app/components/sidenav";
import Footer from '@/src/app/components/footer';
const Header = dynamic(() => import("@/src/app/components/Header"), { ssr: false });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional head elements if necessary */}
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        {/* Flex container for sidebar and main content */}
        <div style={{ display: 'flex', flex: '1', width: '100%' }}>
          <div style={{ height: '100%', flexShrink: 0 }}> {/* Sidebar container */}
            <SideNav />
          </div>
          
          {/* Main content */}
          <div className="content-container">
            {children}
          </div>
        </div>
        
        <Footer /> {/* Footer at the bottom */}
      </body>
    </html>
  );
}
