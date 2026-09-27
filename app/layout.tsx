import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { NotificationProvider } from "@/context/NotificationContext";
// Police pour les titres (Heading)
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

// Police pour le corps de texte (Body / Sans)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata : Metadata = {
  title: "AIESEC Connect",
  description: "Plateforme communautaire et réseau d'échange",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-aiesec-background text-aiesec-text">
        <AuthProvider>
          <DataProvider>          
            <NotificationProvider>          
                {children}
            </NotificationProvider>
          </DataProvider>
        </AuthProvider> 
      </body>
    </html>
  );
}