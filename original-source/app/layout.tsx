import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dog Breed Quiz: Find the Best Dog for You | Dog Academy",
  description:
    "Take our dog breed quiz to find the best breeds for your lifestyle, family, and home—then explore puppies or adoptable dogs near you.",
  openGraph: {
    title: "Dog Breed Quiz: Find Your Perfect Match",
    description: "Find the best dog breeds for your home, lifestyle, family, and personality.",
    type: "website",
    url: "https://dog-breed-match-quiz.amandakayestein.chatgpt.site",
    images: [
      {
        url: "https://dog-breed-match-quiz.amandakayestein.chatgpt.site/og.png",
        width: 1536,
        height: 1024,
        alt: "Dog Breed Quiz — find your perfect Dog Academy match",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dog Breed Quiz: Find Your Perfect Match",
    description: "Find the best dog breeds for your home, lifestyle, family, and personality.",
    images: ["https://dog-breed-match-quiz.amandakayestein.chatgpt.site/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
