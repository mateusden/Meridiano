import { Google_Sans_Flex, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
});

const titleFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-title",
});

export const metadata = {
  metadataBase: new URL("https://globale-nine.vercel.app"),
  title: "Meridiano - jogos diários de geografia, idiomas e história",
  description:
    "Meridiano reúne jogos diários gratuitos: adivinhe o país do dia, o idioma de uma frase, o ano de um conflito e bandeiras históricas. Um desafio novo a cada dia.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Meridiano - jogos diários de geografia, idiomas e história",
    description:
      "Desafios diários gratuitos de geografia, idiomas e história. Um jogo novo a cada dia.",
    url: "/",
    siteName: "Meridiano",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/compass.ico",
  },
  // Quando o Google Search Console te der o código de verificação, descomente:
  verification: { google: "ympSbKr42CtbDdXP1n1emWZaX-ChY7MH3UYsji-llzM" },
};


export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${googleSansFlex.className} ${titleFont.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}