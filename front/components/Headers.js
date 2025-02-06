"use client";
import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";
import Center from "./Center";
import { useCart } from "./CartContext";
import { useSession, signOut } from "next-auth/react";

const StyledHeader = styled.header`
  background-color: #222;
  padding: 10px 0;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
  margin-right: 40px;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  align-items: center;
`;
const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  &:hover {
    color: #fff;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 60px;
    left: ${(props) => (props.isOpen ? "0" : "-100%")};
    width: 100%;
    height: calc(100vh - 60px);
    background: #222;
    padding: 20px;
    transition: left 0.3s ease;
  }
`;

const MobileMenuButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 30px; // Zwiększony odstęp między elementami
`;

const AuthButton = styled.button`
  background: transparent;
  color: #aaa;
  border: 1px solid #aaa;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    color: #fff;
    border-color: #fff;
  }
`;

const RegisterButton = styled(Link)`
  background-color: #4caf50;
  color: white !important;
  padding: 5px 15px;
  border-radius: 5px;
  text-decoration: none;
  &:hover {
    background-color: #45a049;
  }
`;

const CartLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
const CartIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const CartCount = styled.span`
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 5px;
`;

export default function Header() {
  const { getTotalCartCount } = useCart();
  const { data: session, status } = useSession();

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>TechNest</Logo>
          <StyledNav>
            <NavLink href={"/"}>Start</NavLink>
            <NavLink href={"/produkty"}>Produkty</NavLink>
            <NavLink href={"/kategorie"}>Kategorie</NavLink>
            {status === "loading" ? (
              <div>Ładowanie...</div>
            ) : session ? (
              <>
                <NavLink href={"/konto"}>Konto</NavLink>
                <AuthButton onClick={() => signOut({ callbackUrl: "/" })}>
                  Wyloguj
                </AuthButton>
              </>
            ) : (
              <>
                <NavLink href={"/auth/signin"}>Zaloguj</NavLink>
                <RegisterButton href={"/auth/register"}>
                  Rejestracja
                </RegisterButton>
              </>
            )}
            <CartLink href={"/koszyk"}>
              <CartIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: "24px", height: "24px" }}
                >
                  <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
                <CartCount>{getTotalCartCount()}</CartCount>
              </CartIcon>
            </CartLink>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
