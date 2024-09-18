"use client"
import { useScreenStore } from "@/state/screen";
import "./globals.css";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setScreenDimensions = useScreenStore((state) => state.setScreenDimensions);
  
  useEffect(() => {
    const handleResize = () => setScreenDimensions(window.innerHeight, window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
