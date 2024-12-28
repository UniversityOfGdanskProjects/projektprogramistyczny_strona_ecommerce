"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.error) {
      setError("Nieprawidłowy email lub hasło.");
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-2xl font-bold mb-4">Zaloguj się</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-2 mb-4 rounded-lg border"
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            required
            className="w-full p-2 mb-4 rounded-lg border"
          />
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white w-full p-2 rounded-lg"
          >
            Zaloguj się
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.back()}
            className="text-blue-600 underline"
          >
            Powrót
          </button>
        </div>
      </div>
    </div>
  );
}
