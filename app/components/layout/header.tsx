/**
 * 파일명: header.tsx
 * 작성일: 2025-01-26
 * 작성자: 이서연
 * 설명: 코드 정리
 */

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import iconHelp from '../../assets/icons/icon_help.svg';
import iconProfile from '../../assets/icons/icon_profile.svg';

interface HeaderProps {
  title: string;
  onHelpClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onHelpClick, onProfileClick }) => {
  return (
    <HeaderContainer>
      <Logo>{title}</Logo>
      <IconWrapper>
        <IconHelp src={iconHelp} alt="Help" onClick={onHelpClick} />
        <IconProfile src={iconProfile} alt="Profile" onClick={onProfileClick} />
      </IconWrapper>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 16px 24px;
  width: 375px;
  height: 56px;
  background: var(
    --black,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #171612
  );
`;

const Logo = styled.div`
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: 24px; /* 100% */
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const IconHelp = styled(Image)`
  cursor: pointer;
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const IconProfile = styled(Image)`
  cursor: pointer;
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
