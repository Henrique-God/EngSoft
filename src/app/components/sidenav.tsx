import NavLinks from '@/src/app/components/navlinks';


export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-[#BEECAE] text-black"> {/* Changed background color */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-[#BEECAE] md:block"></div>
      </div>
    </div>
  );
}
