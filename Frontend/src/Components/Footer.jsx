import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 2rem 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 6rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`;

const FooterLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <span>© {new Date().getFullYear()} TaskMan | Tüm Hakları Saklıdır</span>
        <span>•</span>
        <FooterLink
          href="https://enescanadil.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Enes Can Adil
        </FooterLink>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;
