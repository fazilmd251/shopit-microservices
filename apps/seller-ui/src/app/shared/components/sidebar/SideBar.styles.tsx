import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #1e1e2f;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem 1rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  z-index: 1000;
`;

export const SidebarHeader = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
`;

export const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

export const SidebarMenuItem = styled.li<{active?: boolean}>`
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: ${({active}) => (active ? "#353553" : "transparent")};
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #353553;
  }
`;

export const SidebarFooter = styled.div`
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: #bbb;
  text-align: center;
  border-top: 1px solid #444466;
`;

