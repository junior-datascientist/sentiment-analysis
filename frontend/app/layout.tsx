import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Sentiment Analysis",
  description:
    "An NLP-powered application for classifying customer reviews into Positive, Negative and Neutral sentiments.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
