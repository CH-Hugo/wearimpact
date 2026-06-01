import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "WearImpact",
  description: "Calculez l'impact environnemental de vos vêtements",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}