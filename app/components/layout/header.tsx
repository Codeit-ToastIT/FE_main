/**
 * 파일명: header.tsx
 * 작성일: 2025-01-17
 * 작성자: 이서연
 * 설명: header 컴포넌트 구현.
 */

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import helpIcon from '../../assets/icons/help_icon.png';
import userIcon from '../../assets/icons/user_icon.png';

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

interface HeaderProps {
  title: string;
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onHelpClick }) => {
  return (
    <HeaderContainer>
      <Logo>{title}</Logo>
      <IconWrapper>
        <Icons src={helpIcon} alt="Help" width={24} height={24} onClick={onHelpClick} />
        <Icons src={userIcon} alt="User" width={24} height={24} />
      </IconWrapper>
    </HeaderContainer>
  );
};

export default Header;
