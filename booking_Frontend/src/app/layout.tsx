import type React from "react";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SWRProvider from "@/components/ui/SWRProvider";
import { SidebarProvider } from "./(dashboard)/context/contextAdmin";
import UserProvider from "./(dashboard)/context/UserProvider";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bevietnam", // dùng với Tailwind nếu muốn
});

export const metadata: Metadata = {
  title: "Trang DashBoard",
  description: "trang quản lý",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${beVietnamPro.className} ${beVietnamPro.variable}`}>
        <Toaster />
        <main id="root">
          <UserProvider>
            <SidebarProvider>
              <SWRProvider>{children}</SWRProvider>
            </SidebarProvider>
          </UserProvider>
        </main>
      </body>
    </html>
  );
}
