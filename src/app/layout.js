"use client"

// Import all styles
import '../styles/styles.css';

// Used for common components
import 'semantic-ui-css/semantic.min.css';

// Custom font I like
import { Inter } from 'next/font/google';

// For useEffect
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Used for the website's title
// export const metadata = {
//   title: 'Shingle Rate Tool',
// };

// Root layout for all pages
export default function RootLayout({ children, pageProps }) {

  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.ready.then((registration) => {
  //       registration.unregister();
  //     });
  //   }
  // }, []);

  return (
    <html lang="en">
      <body className={inter.className} >{children}</body>
    </html>
  );
}
