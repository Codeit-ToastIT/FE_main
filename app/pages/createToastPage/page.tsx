/**
 * 파일명: createToastPage/page.tsx
 * 작성일: 2025-01-25
 * 작성자: 이서연
 * 설명: PR 최종
 */

'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SaveToast from '../../components/SaveToast';

import Home from './home';
import Help from './help';

export default function CreateToastPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // 최초 방문 여부 확인 후 온보딩 표시
    const onboardingViewed = localStorage.getItem('onboardingViewed');
    if (!onboardingViewed) {
      setShowOnboarding(true);
      localStorage.setItem('onboardingViewed', 'true'); // 최초 방문 시 저장
    }
  }, []);

  const [isLongPress, setIsLongPress] = useState(false);
  const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState<string | null>(null); // 저장 메시지 상태

  // 메모 ID, 제목, 내용 상태
  const [memoId] = useState(() => '1');
  const [title, setTitle] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const handleMouseDown = () => {
    const timeout = setTimeout(() => setIsLongPress(true), 2000); // 2초 누르면 SaveToast 표시
    setPressTimeout(timeout);
  };

  const handleMouseUp = () => {
    if (pressTimeout) clearTimeout(pressTimeout); // 타이머 취소
    setPressTimeout(null);
  };

  const handleCloseModal = (selectedCategory?: string) => {
    setIsLongPress(false); // SaveToast 닫기
    if (selectedCategory) {
      // 저장 완료 메시지 설정
      setShowSaveMessage(`${selectedCategory}에 저장되었어요.`);
      // 메시지 2초 후 사라지기
      setTimeout(() => setShowSaveMessage(null), 2000);
    }
  };

  return (
    <div>
      <Home onHelpClick={() => setShowOnboarding(true)} />
      {showOnboarding && <Help onClose={() => setShowOnboarding(false)} />}
      <Container
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <TitleInput
          placeholder="제목을 입력하세요"
          value={title || ''}
          onChange={(e) => setTitle(e.target.value || null)}
        />
        <ContentInput
          placeholder="내용을 입력하세요"
          value={content || ''}
          onChange={(e) => setContent(e.target.value || null)}
        />
        {isLongPress && (
          <SaveToast
            onClose={handleCloseModal}
            onSave={(category) => console.log(`Saved to category: ${category}`)}
            memoId={memoId}
            title={title}
            content={content}
          />
        )}
        {showSaveMessage && (
          <SaveMessage>
            <SaveBold>{showSaveMessage.split('에 저장되었어요.')[0]}</SaveBold>에 저장되었어요.
          </SaveMessage>
        )}
      </Container>
    </div>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  position: relative;
`;

const TitleInput = styled.input`
  width: 90%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const ContentInput = styled.textarea`
  width: 90%;
  height: 300px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  resize: none;
`;

const SaveMessage = styled.div`
  position: absolute;
  bottom: 148px;
  left: calc(50% - 125.5px);
  width: 251px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background: rgba(23, 22, 18, 0.8);
  border-radius: 40px;
  font-family: 'SUIT';
  font-style: normal;
  font-size: 14px;
  line-height: 16px;
  color: #e5dcca;
  text-align: center;
  white-space: nowrap;
`;

const SaveBold = styled.span`
  font-weight: 800;
`;
