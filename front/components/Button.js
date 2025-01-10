"use client";
import styled from "styled-components";

const StyledButton = styled.button`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  svg {
    height: 16px;
    margin-right: 5px;
  }
  ${(props) =>
    props.$white &&
    `
    background-color: #fff;
    color: #000;
  `}
  ${(props) =>
    props.$white &&
    props.$outline &&
    `
    background-color: transparent;
    color: #fff;
    border: 1px solid #fff;
  `}
  ${(props) =>
    props.$primary &&
    `
    background-color: #5542F6;
    color: #fff;
  `}
`;

export default function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
