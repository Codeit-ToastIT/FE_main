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
import LoadToast from '../../components/LoadToast';

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

  // ------------------------------------------------------------- 💖임사랑 - SaveToast 관련 추가되는 부분
  const [isLongPress, setIsLongPress] = useState(false);
  const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState<string | null>(null); // 저장 메시지 상태

  // 활성 메모 id 상태 추가 (상위에서 관리)
  const [activeMemoId, setActiveMemoId] = useState<string>('1');

  const [isDoubleClick, setIsDoubleClick] = useState(false);

  // 더블클릭 이벤트 핸들러
  const handleDoubleClick = () => {
    console.log('더블클릭 이벤트 발생');
    setIsDoubleClick(true);
    setShowSaveMessage('더블클릭으로 저장되었습니다!');

    // 일정 시간 후 더블클릭 상태 초기화
    setTimeout(() => {
      setIsDoubleClick(false);
    }, 2000); // 2초 후 초기화
  };

  // 메모 ID, 제목, 내용 상태
  const [_memoId] = useState(() => '1');
  const [title, _setTitle] = useState<string | null>(null);
  const [content, _setContent] = useState<string | null>(null);

  // 1초 이상 꾹 누르면 SaveToast 띄우기
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    const timeout = setTimeout(() => {
      setIsLongPress(true);
    }, 1000);
    setPressTimeout(timeout);
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
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

  // 상위에서 활성 메모 id를 갱신할 콜백 (Home → Body에서 전달됨)
  const handleActiveMemoChange = (id: string) => {
    setActiveMemoId(id);
  };

  // ------------------------------------------------------------- 💖임사랑 - SaveToast 관련 추가되는 부분

  // 임사랑 - return 부분 수정.
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown} // 터치 시작 감지
      onTouchEnd={handleMouseUp} // 터치 종료 감지
      onTouchCancel={handleMouseUp} // 터치 취소 시 처리
    >
      <Home
        onHelpClick={() => setShowOnboarding(true)}
        onActiveMemoChange={handleActiveMemoChange} // 💖 추가
      />
      {showOnboarding && <Help onClose={() => setShowOnboarding(false)} />}
      {isLongPress && (
        <SaveToastWrapper onClick={handleCloseSaveToast}>
          <SaveToast
            onClose={handleCloseSaveToast}
            onSave={handleSave}
            memoId={activeMemoId} // 💖 수정
            title={title}
            content={content}
            onClick={(e) => e.stopPropagation()} // SaveToast 내부 클릭 시 닫히지 않도록 막기
          />
        </SaveToastWrapper>
      )}
      {isDoubleClick && (
        <SaveToastWrapper onDoubleClick={handleDoubleClick}>
          <LoadToast onClose={handleCloseSaveToast} onSave={handleSave} />
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

export const SaveMessage = styled.div`
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
