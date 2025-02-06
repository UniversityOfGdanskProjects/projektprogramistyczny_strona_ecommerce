"use client";
import { useState } from "react";
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

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
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
  &:disabled {
    background-color: #666;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Wystąpił błąd podczas rejestracji");
      }

      router.push("/auth/signin");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <FormWrapper>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Rejestracja
        </h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <StyledForm onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              name="firstName"
              placeholder="Imię"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Nazwisko"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </Button>
        </StyledForm>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            href="/auth/signin"
            style={{ color: "#222", textDecoration: "underline" }}
          >
            Masz już konto? Zaloguj się
          </Link>
        </div>
      </FormWrapper>
    </>
  );
}
