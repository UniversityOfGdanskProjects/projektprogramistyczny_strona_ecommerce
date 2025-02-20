"use client";
import { GlobalStyles } from "./styles";
import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import StyledComponentsRegistry from "./registry";

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <SessionProvider>
            <CartContextProvider>
              <GlobalStyles />
              {children}
            </CartContextProvider>
          </SessionProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
