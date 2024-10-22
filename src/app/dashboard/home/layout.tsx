import SideNav from '@/src/app/components/sidenav';
import Footer from '../../components/footer';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-40">
          <SideNav />
        </div>
        <div className="flex-grow md:overflow-y-auto pl-8">{children}</div>
      </div>
      <Footer></Footer>
    </div>
  );
}