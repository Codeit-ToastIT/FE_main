/**
 * 파일명: MemoHeader.tsx
 * 작성일: 2025-01-27
 * 작성자: 이서연
 * 설명: 메모 작성 화면 header 부분 UI 설계.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import iconBack from '../../assets/icons/icon_back.svg';
import iconTrash from '../../assets/icons/icon_trash.svg';

interface MemoHeaderProps {
  onBackClick: () => void;
  onTrashClick: () => void;
}

export default function MemoHeader({ onBackClick, onTrashClick }: MemoHeaderProps) {
  return (
    <HeaderContainer>
      <IconBack src={iconBack} alt="Back" onClick={onBackClick} />
      <TitleInput type="text" placeholder="토스트의 제목을 입력해주세요." />
      <IconTrash src={iconTrash} alt="Trash" onClick={onTrashClick} />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  display: flex;
  height: 60px;
  padding: 12px 16px 8px 16px;
  justify-content: center;
  align-items: center;
  background: #e5dcca;
`;

const IconBack = styled(Image)`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
  border-radius: 40px;
  background: var(--black, #171612);
  cursor: pointer;
`;

const TitleInput = styled.input`
  width: 263px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 40px;
  background: var(--black, #171612);
  border: none;
  outline: none;
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 16px;
  font-weight: 800;
  line-height: 20px; /* 125% */

  ::placeholder {
    color: var(--ivory, #e5dcca);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const IconTrash = styled(Image)`
  display: flex;
  width: 40px;
  height: 40px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 40px;
  background: var(--black, #171612);
  cursor: pointer;
`;
