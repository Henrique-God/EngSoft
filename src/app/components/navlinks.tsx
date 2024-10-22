import { josefinSans } from '@/src/app/fonts/fonts';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

// Map of links to display in the side navigation.
const links = [
  { name: 'Home', href: '/dashboard/home', icon: HomeIcon },
  {
    name: 'Wiki',
    href: '/dashboard/wiki',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Forum', href: '/dashboard/forum', icon: UserGroupIcon },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className={`${josefinSans.className} flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-[#BEECAE] p-3 text-black text-sm font-medium hover:bg-[#A8D5A5] hover:text-black-600 md:flex-none md:justify-start md:p-2 md:px-3`}
          >
            <LinkIcon className="w-6 text-black" /> {/* Icon color */}
            <p className="hidden md:block">{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
