import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSettings } from '../contexts/SettingsContext';

const ScrollButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.mode === 'dark' ? '#4a9eff' : '#2563eb'};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  opacity: ${props => props.$visible ? '1' : '0'};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transform: ${props => props.$visible ? 'translateY(0)' : 'translateY(20px)'};
  z-index: 1000;

  &:hover {
    background: ${props => props.theme.mode === 'dark' ? '#3b8ae6' : '#1d4ed8'};
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media print {
    display: none;
  }
`;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const { theme } = useSettings();

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      setVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <ScrollButton 
      onClick={scrollToTop} 
      $visible={visible}
      theme={theme}
      aria-label="Scroll to top"
    >
      ↑
    </ScrollButton>
  );
};

export default ScrollToTop;
