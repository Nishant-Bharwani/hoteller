import { Inter, Nunito } from 'next/font/google';
import ClientOnly from './components/ClientOnly';
import Modal from './components/shared/modals/Modal';
import Navbar from './components/shared/navbar/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hoteller',
  description: 'Hoteller - frontend',
}

const font = Nunito({
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <Modal isOpen />
          <Navbar />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
