"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import Header from "@/components/Headers";

const FormWrapper = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: #888;
  }
`;

const Button = styled.button`
  background-color: #222;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

const RegisterLink = styled(Link)`
  color: #222;
  text-decoration: none;
  text-align: center;
  display: block;
  margin-top: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterButton = styled(Link)`
  display: block;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  &:hover {
    background-color: #45a049;
  }
`;

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError("Nieprawidłowe dane logowania");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Wystąpił błąd podczas logowania");
    }
  }

  return (
    <>
      <Header />
      <FormWrapper>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Logowanie</h1>
        {error && (
          <div
            style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
          >
            {error}
          </div>
        )}
        <StyledForm onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Zaloguj się</Button>
        </StyledForm>
        <RegisterButton href="/auth/register">
          Nie masz konta? Zarejestruj się tutaj
        </RegisterButton>
      </FormWrapper>
    </>
  );
}
