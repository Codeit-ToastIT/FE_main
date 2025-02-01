/**
 * 파일명: MemoHeader.tsx
 * 작성일: 2025-01-27
 * 작성자: 이서연
 * 설명: 메모 삭제 로직 구현.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import iconBack from '../../assets/icons/icon_back.svg';
import iconTrash from '../../assets/icons/icon_trash.svg';

import DeleteModal from '../common/DeleteModal';

interface MemoHeaderProps {
  toastId: string; // ✅ 개별 토스트 ID를 받아옴
}

export default function MemoHeader({ toastId }: MemoHeaderProps) {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (toastId) {
      const savedTitle = localStorage.getItem(`memoTitle_${toastId}`);
      if (savedTitle) setTitle(savedTitle);
    }
  }, [toastId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    localStorage.setItem(`memoTitle_${toastId}`, newTitle); // ✅ ID별로 저장
  };

  const handleBackClick = () => {
    router.push('/pages/createToastPage');
  };

  const handleDeleteClick = () => {
    setShowModal(true); // ✅ 삭제 모달 띄우기
  };

  // ✅ 삭제 실패 상태를 localStorage에 저장하도록 변경
  const handleDeleteMemo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/memos/${toastId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 메모 삭제 성공:', data.message);

        // ✅ localStorage에서도 해당 메모 삭제
        localStorage.removeItem(`memoTitle_${toastId}`);
        localStorage.removeItem(`memo_${toastId}`);

        // ✅ 삭제 성공 상태 저장
        localStorage.setItem('deletedMemoId', toastId);
        localStorage.setItem('deleteSuccess', 'true');
      } else {
        console.error('❌ 메모 삭제 실패:', data.message);

        // ✅ 삭제 실패 상태 저장
        localStorage.setItem('deleteError', 'true');
      }
    } catch (error) {
      console.error('❌ 메모 삭제 요청 오류:', error);

      // ✅ 삭제 실패 상태 저장
      localStorage.setItem('deleteError', 'true');
    } finally {
      setLoading(false);
      router.push('/pages/createToastPage'); // ✅ 홈 화면으로 이동
    }
  };

  return (
    <HeaderContainer>
      <IconBack src={iconBack} alt="Back" onClick={handleBackClick} />
      <TitleInput
        type="text"
        placeholder="토스트의 제목을 입력해주세요."
        value={title}
        onChange={handleTitleChange}
      />
      <IconTrash src={iconTrash} alt="Trash" onClick={handleDeleteClick} />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteMemo}
      />
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
