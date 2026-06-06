import "./globals.css";

export const metadata = {
  title: "Kodular Craft AI — Prompt to Mobile App Screens Instantly",
  description: "Generate, preview, modify, and optimize fully production-ready Kodular mobile layout blocks and application screens instantly using natural language prompts.",
  keywords: ["Kodular", "AI App Builder", "Android Extension Development", "Low Code Mobile UI", "Gemini AI"],
  authors: [{ name: "glich" }],
  openGraph: {
    title: "Kodular Craft AI — Prompt to Screen Engine",
    description: "Generate, scale, and copy functional UI layout segments directly inside your Kodular workflow with modern generative intelligence prompts.",
    url: "https://prompt2screen.vercel.app",
    siteName: "Kodular Craft AI",
    images: [
      {
        url: "/assets/og-image.png", // Placed within public/assets/
        width: 1200,
        height: 630,
        alt: "Kodular Craft AI Dashboard Interface Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodular Craft AI — Prompt to Mobile Screens",
    description: "Modify UI structures natively with automated structural layouts based on standard prompt inputs.",
    images: ["/assets/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}