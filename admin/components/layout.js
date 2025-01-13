"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Nav from "./nav.js";
import { usePathname } from "next/navigation";
import Logo from "./logo.js";
import SharedLogin from "./SharedLogin";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) {
    return <SharedLogin />;
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="bg-bgGray w-screen h-screen flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg">
          <p>Brak uprawnień administratora</p>
          <button
            onClick={() => signOut()}
            className="bg-blue-500 text-white p-2 rounded mt-2"
          >
            Wyloguj się
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="md:hidden flex items-center p-4 ">
        <button onClick={() => setShowNav(!showNav)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex grow justify-center">
          <Logo />
        </div>
      </div>

      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">
          {children}
          {pathname === "/" && (
            <button onClick={() => signOut()} className="btn-primary mt-4">
              Wyloguj się
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
