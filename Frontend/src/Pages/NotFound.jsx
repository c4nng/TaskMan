import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  height: 100vh;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Code = styled.h1`
  font-size: 6rem;
  color: #ef4444;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #374151;
`;

const StyledLink = styled(Link)`
  margin-top: 1.5rem;
  display: inline-block;
  background-color: #2563eb;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background-color: #1e40af;
  }
`;

const NotFound = () => {
  return (
    <Wrapper>
      <Code>404</Code>
      <Message>Sayfa bulunamadı. Böyle bir yol yok gibi görünüyor...</Message>
      <StyledLink to="/dashboard">Ana Sayfaya Dön</StyledLink>
    </Wrapper>
  );
};

export default NotFound;
