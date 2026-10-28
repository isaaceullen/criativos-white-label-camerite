import type { Metadata } from "next";
import { inter, specify, univers } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Camerite · Gerador de Posts White Label",
  description: "Personalize os posts da campanha Black November com as cores, fontes e logo da sua marca.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${specify.variable} ${univers.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}
