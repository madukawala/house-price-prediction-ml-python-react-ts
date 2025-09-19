import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterText>
        Built with React & FastAPI | Machine Learning Model: Random Forest & Linear Regression
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;