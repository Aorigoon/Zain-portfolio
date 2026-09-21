import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Zainulabidin - Portfolio",
  description: "I design & build full-stack web products that ship & scale.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800;900&family=Noto+Sans:wght@300;400;500;600;700;800;900&family=Caveat:wght@700&family=Reenie+Beanie&family=Montserrat:wght@900&display=swap" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/aos.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <Script src="/assets/js/phosphor-icon.js" />
      </head>
      <body suppressHydrationWarning>
        {children}
        
        {/* Scripts loaded sequentially with defer */}
        <Script src="/assets/js/jquery-3.7.1.min.js" />
        <Script src="/assets/js/boostrap.bundle.min.js" />
        <Script src="/assets/js/aos.js" />
        <Script src="/assets/js/purecounter.js" />
        <Script src="/assets/js/magnific-popup.min.js" />
        <Script src="/assets/js/main.js" />
      </body>
    </html>
  );
}
