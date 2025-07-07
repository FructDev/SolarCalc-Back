import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Importar la fuente
import "./globals.css";

// 2. Configurar la fuente
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora Solar RD",
  description: "Descubre Cuánto Ahorrarías con Paneles Solares en RD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* 3. Aplicar la fuente al body */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
