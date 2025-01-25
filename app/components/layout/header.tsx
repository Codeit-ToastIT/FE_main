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
import iconUser from '../../assets/icons/icon_profile.svg';

interface HeaderProps {
  title: string;
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onHelpClick }) => {
  return (
    <HeaderContainer>
      <Logo>{title}</Logo>
      <IconWrapper>
        <Icons src={iconHelp} alt="Help" width={24} height={24} onClick={onHelpClick} />
        <Icons src={iconUser} alt="User" width={24} height={24} />
      </IconWrapper>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #171612;
  color: #e5dcca;
  padding: 16px 24px;
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 24px;
  line-height: 24px;
  font-family: 'SUIT', sans-serif;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 40px;
`;

const Icons = styled(Image)`
  cursor: pointer;
`;
