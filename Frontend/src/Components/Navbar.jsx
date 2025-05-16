import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import logo from '/logo.png'; // public klasöründeyse doğrudan /logo.png de olur

const Bar = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  margin-bottom: 4rem;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const EmailText = styled.span`
  font-size: 0.95rem;
  opacity: 0.9;
`;

const LogoutBtn = styled.button`
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: #1e293b;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email || 'Misafir';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Bar>
      <Brand>
        <Logo src="/logo.png" alt="TaskMan Logo" />
        <Title>TaskMan | Görev Takip</Title>
      </Brand>
      <Right>
        <EmailText>{email}</EmailText>
        <LogoutBtn onClick={handleLogout}>
          <FiLogOut /> Çıkış
        </LogoutBtn>
      </Right>
    </Bar>
  );
};

export default Navbar;
