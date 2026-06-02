import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Encuesta de recomendaciones para mejorar el curso",
  description: "Esta encuesta es anónima. El objetivo es conocer qué actividades, temas y trabajos podrían mantenerse o mejorarse en próximos semestres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
