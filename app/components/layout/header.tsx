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
  padding: 10px 20px;
  font-size: 1.5rem;
`;

const Logo = styled.div`
  font-weight: bold;
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
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <HeaderContainer>
      <Logo>{title}</Logo>
      <IconWrapper>
        <Icons src={helpIcon} alt="Help" width={24} height={24} />
        <Icons src={userIcon} alt="User" width={24} height={24} />
      </IconWrapper>
    </HeaderContainer>
  );
};

export default Header;
