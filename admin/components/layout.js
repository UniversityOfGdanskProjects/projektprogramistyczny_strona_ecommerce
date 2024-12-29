"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Nav from "./nav.js";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [error, setError] = useState(null);

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
      <div className="bg-blue-900 w-screen h-screen flex">
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
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />

      <div className="bg-white flex-grow mt-2 text-blue-900 mr-2 rounded-lg pl-4 mb-2">
        {children}
        <button
          onClick={() => signOut()}
          className="bg-white text-blue-900 p-2 px-4 rounded-lg mt-4 "
        >
          Wyloguj się
        </button>
      </div>
    </div>
  );
}
