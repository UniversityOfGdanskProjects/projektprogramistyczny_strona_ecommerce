"use client";
import { useSession } from "next-auth/react";
import styled from "styled-components";

const AccountContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <AccountContainer>
      <Title>Moje konto</Title>
      <div>
        <p>Email: {session?.user?.email}</p>
      </div>
    </AccountContainer>
  );
}
