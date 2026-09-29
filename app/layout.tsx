import "./globals.css";
import React from "react";

export const metadata = {
  title: "Zainulabidin - Real Portfolio",
  description: "I design & build full-stack web products that ship & scale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800;900&display=swap" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
