"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Nav from "./nav.js";
import { usePathname } from "next/navigation";
import Logo from "./logo.js";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const pathname = usePathname();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Nieprawidłowy email lub hasło");
    } else {
      setError(null);
    }
  };

  if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="p-2 mb-2 rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="p-2 mb-2 rounded-lg"
          />
          <button type="submit" className="bg-white p-2 px-4 rounded-lg">
            Zaloguj się
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
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
            <button onClick={() => signOut()} className=" btn-primary mt-4">
              Wyloguj się
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
