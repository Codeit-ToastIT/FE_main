import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import iconBack from '../../assets/icons/icon_back.svg';
import iconTrash from '../../assets/icons/icon_trash.svg';
import DeleteModal from '../../components/common/DeleteModal';

interface MemoHeaderProps {
  toastId: string;
  title: string;
  setTitle: (title: string) => void;
  content: string; // ✅ 본문도 함께 요청해야함
  isBurnt: boolean;
  onSave: () => void; // ✅ 저장 버튼 클릭 시 호출될 함수
}

export default function MemoHeader({
  toastId,
  title,
  setTitle,
  content,
  isBurnt,
}: MemoHeaderProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    try {
      console.log('📌 PATCH 요청 전 확인:', { toastId, title, content });

      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, content: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ 서버 응답 상태:', response.status);
        console.error('❌ 서버 응답 메시지:', data);
        throw new Error(`메모 제목 수정 실패: ${data.message || '알 수 없는 오류'}`);
      }

      console.log('✅ 메모 제목 수정 성공:', data);
    } catch (error) {
      console.error('❌ 메모 제목 수정 요청 오류:', error);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleDeleteClick = () => {
    setShowModal(true); // ✅ 삭제 모달 띄우기
  };

  // ✅ 삭제 실패 상태를 localStorage에 저장하도록 변경
  const handleDeleteMemo = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/memos/${toastId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ 메모 삭제 성공:', data.message);

        // ✅ localStorage에 삭제된 메모 ID & 성공 여부 저장
        localStorage.setItem('deletedMemoId', toastId);
        localStorage.setItem('deleteSuccess', 'true');
        window.history.back();
        return true;
      } else {
        console.error('❌ 메모 삭제 실패:', data.message);

        // ✅ localStorage에 삭제 실패 여부 저장
        localStorage.setItem('deleteSuccess', 'false');
        return false;
      }
    } catch (error) {
      console.error('❌ 메모 삭제 요청 오류:', error);
      localStorage.setItem('deleteSuccess', 'false');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderContainer isBurnt={isBurnt}>
      <IconBack src={iconBack} alt="Back" onClick={handleBackClick} />
      <TitleInput type="text" placeholder={title} value={title} onChange={handleTitleChange} />
      <IconTrash src={iconTrash} alt="Trash" onClick={handleDeleteClick} />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClick={handleDeleteMemo}
      />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header<{ isBurnt: boolean }>`
  display: flex;
  height: 60px;
  padding: 12px 16px 8px 16px;
  justify-content: center;
  align-items: center;
  background: ${({ isBurnt }) => (isBurnt ? '#806952' : '#e5dcca')};
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

  font-size: 16px;
  font-weight: 800;
  line-height: 20px; /* 125% */

  /* 말줄임표를 위한 설정 */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

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
