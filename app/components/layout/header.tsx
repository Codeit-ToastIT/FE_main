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

export default function Header({ title, onHelpClick, onProfileClick }: HeaderProps) {
  return (
    <HeaderContainer>
      <Logo>{title}</Logo>
      <IconWrapper>
        <Icon onClick={onHelpClick}>
          <Image src={iconHelp} alt="Help" width={24} height={24} />
        </Icon>
        <Icon onClick={onProfileClick}>
          <Image src={iconProfile} alt="Profile" width={24} height={24} />
        </Icon>
      </IconWrapper>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 16px 24px;
  width: 375px;
  height: 56px;
  background: #171612;
`;

const Logo = styled.div`
  color: #e5dcca;

  font-size: 24px;
  font-weight: 800;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const Icon = styled.div`
  cursor: pointer;
  display: flex;
  width: 24px;
  height: 24px;
`;
