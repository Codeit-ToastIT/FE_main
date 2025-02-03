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

  // ------------------------------------------------------------- 임사랑 - SaveToast 관련 추가되는 부분
  const [isLongPress, setIsLongPress] = useState(false);
  const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState<string | null>(null); // 저장 메시지 상태

  // 메모 ID, 제목, 내용 상태
  const [memoId] = useState(() => '1');
  const [title, setTitle] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  // 1초 이상 꾹 누르면 SaveToast 띄우기
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    const timeout = setTimeout(() => {
      setIsLongPress(true);
    }, 1000);
    setPressTimeout(timeout);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (pressTimeout) clearTimeout(pressTimeout);
    setPressTimeout(null);
  };

  const handleCloseSaveToast = () => {
    setIsLongPress(false);
  };

  const handleSave = (category: string) => {
    setShowSaveMessage(`${category}에 저장되었어요.`);

    // 2초 후 메시지 사라지게 설정
    setTimeout(() => {
      setShowSaveMessage(null);
    }, 2000);
  };

  // ------------------------------------------------------------- 임사랑 - SaveToast 관련 추가되는 부분

  // 임사랑 - return 부분 수정.
  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <Home onHelpClick={() => setShowOnboarding(true)} />
      {showOnboarding && <Help onClose={() => setShowOnboarding(false)} />}
      {isLongPress && (
        <SaveToastWrapper onClick={handleCloseSaveToast}>
          <SaveToast
            onClose={handleCloseSaveToast}
            onSave={handleSave}
            memoId={memoId}
            title={title}
            content={content}
            onClick={(e) => e.stopPropagation()} // SaveToast 내부 클릭 시 닫히지 않도록 막기
          />
        </SaveToastWrapper>
      )}
      {showSaveMessage && (
        <SaveMessage>
          <SaveBold>{showSaveMessage.split('에 저장되었어요.')[0]}</SaveBold>에 저장되었어요.
        </SaveMessage>
      )}
    </div>
  );
}

const SaveToastWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
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
