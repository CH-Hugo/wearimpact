import "./globals.css";
import Navbar from "@/components/Navbar";
import { Nunito, Poppins } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-nunito',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
})

export const metadata = {
  title: "WearImpact",
  description: "Calculez l'impact environnemental de vos vêtements",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <body className={`min-h-full flex flex-col ${nunito.variable} ${poppins.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}