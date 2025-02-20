import styled, { createGlobalStyle } from "styled-components";

const StyledDiv = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;
export default function Center({ children }) {
  return <StyledDiv>{children}</StyledDiv>;
}
