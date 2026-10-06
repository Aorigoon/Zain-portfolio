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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800;900&family=Noto+Sans:wght@300;400;500;600;700;800;900&family=Caveat:wght@700&family=Reenie+Beanie&family=Montserrat:wght@900&family=Kaushan+Script&family=Bebas+Neue&display=swap" />
        <link rel="preload" href="/ink-transition-sprite.png" as="image" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: "history.scrollRestoration='manual';window.scrollTo(0,0);",
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
