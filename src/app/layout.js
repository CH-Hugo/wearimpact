import "./globals.css";

export const metadata = {
  title: "WearImpact",
  description: "Calculez l'impact environnemental de vos vêtements",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
