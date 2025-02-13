/**
 * 파일명: createToastComponent.tsx
 * 작성일: 2025-02-08
 * 작성자: 이서연
 * 설명: 회원가입 시 온보딩 1회 구현 완료
 */

'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SaveToast from '../../components/SaveToast';
import LoadToast from '../../components/LoadToast';

import Home from './home';
import Help from './help';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreateToastComponent() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { message } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // localStorage에 "onBoardingShown" 값이 없을 때만 온보딩을 표시
    const onBoardingShown = localStorage.getItem('onBoardingShown');

    if (message === '회원가입이 완료되었습니다.' && !onBoardingShown) {
      setShowOnboarding(true);
      localStorage.setItem('onBoardingShown', 'true'); // 온보딩이 표시된 적 있음을 저장
    }
  }, [message]); // ✅ message 값이 변경될 때만 실행되도록 설정

  // ------------------------------------------------------------- 💖임사랑 - SaveToast 관련 추가되는 부분
  const [isLongPress, setIsLongPress] = useState(false);
  const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState<string | null>(null); // 저장 메시지 상태
  const [forceRerender, setForceRerender] = useState(0); // 리렌더링을 위한 key 상태

  // 활성 메모 id 상태 추가 (상위에서 관리)
  const [activeMemoId, setActiveMemoId] = useState<string>('1');
  const [isDoubleClick, setIsDoubleClick] = useState(false);

  // 더블클릭 이벤트 핸들러
  const handleDoubleClick = () => {
    setIsDoubleClick(true);
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

    setForceRerender((prev) => prev + 1); // 강제 리렌더링

    // 2초 후 메시지 사라지게 설정
    setTimeout(() => {
      setShowSaveMessage(null);
    }, 2000);
  };

  // 상위에서 활성 메모 id를 갱신할 콜백 (Home → Body에서 전달됨)
  const handleActiveMemoChange = (id: string) => {
    setActiveMemoId(id);
  };

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/loadToastPage?category=${categoryId}`);
  };

  // ------------------------------------------------------------- 💖임사랑 - SaveToast 관련 추가되는 부분

  // 임사랑 - return 부분 수정.
  return (
    <div
      key={forceRerender}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown} // 터치 시작 감지
      onTouchEnd={handleMouseUp} // 터치 종료 감지
      onTouchCancel={handleMouseUp} // 터치 취소 시 처리
      onDoubleClick={handleDoubleClick}
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
          <LoadToast onClose={handleCloseSaveToast} onCategorySelect={handleCategorySelect} />
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
  bottom: 180px;
  left: calc(50% - 125.5px);
  width: 251px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background: rgba(23, 22, 18, 0.8);
  border-radius: 40px;

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
