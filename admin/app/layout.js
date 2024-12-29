// app/layout.js

"use client";

import { SessionProvider } from "next-auth/react";
import Nav from "@/components/nav";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
