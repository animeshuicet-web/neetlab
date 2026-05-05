import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEETlab — Interactive 3D Chemistry for NEET ",
  description:
    "India's first interactive 3D chemistry platform for NEET aspirants. Visualize orbitals, mechanisms, and molecules in 3D. Stop memorizing — start exploring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}