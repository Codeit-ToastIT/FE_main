/**
 * 파일명: page.tsx
 * 작성일: 2025-01-25
 * 작성자: 이서연
 * 설명: Home 화면 구현.
 */
'use client';

import React, { useEffect, useState } from 'react';
import Home from './home';
import Help from './help';

const CreateToastPage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // 최초 방문 여부 확인 후 온보딩 표시
    const onboardingViewed = localStorage.getItem('onboardingViewed');
    if (!onboardingViewed) {
      setShowOnboarding(true);
      localStorage.setItem('onboardingViewed', 'true'); // 최초 방문 시 저장
    }
  }, []);

  return (
    <div>
      <Home onHelpClick={() => setShowOnboarding(true)} />
      {showOnboarding && <Help onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default CreateToastPage;
