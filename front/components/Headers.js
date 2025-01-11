"use client";
import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";
import Center from "./Center";
import { useCart } from "./CartContext";

const StyledHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 15px;
`;

export default function Header() {
  const { cartProducts, getTotalCartCount } = useCart();

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>TechNest</Logo>
          <StyledNav>
            <NavLink href={"/"}>Strona Główna</NavLink>
            <NavLink href={"/produkty"}>Wszystkie produkty</NavLink>
            <NavLink href={"/kategorie"}>Kategorie</NavLink>
            <NavLink href={"/konto"}>Konto</NavLink>
            <NavLink href={"/koszyk"}>Koszyk ({getTotalCartCount()})</NavLink>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
