import { Inter, Lusitana, Josefin_Sans } from 'next/font/google';

// Define Inter and Lusitana
export const inter = Inter({ subsets: ['latin'] });
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

// Add Josefin Sans
export const josefinSans = Josefin_Sans({
  weight: ['400', '600', '700'], // Choose the weights you need
  subsets: ['latin'],
});
