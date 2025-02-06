/**
 * 파일명: myPage.tsx
 * 작성일: 2025-02-05
 * 작성자: 이서연
 * 설명: 마이페이지 컴포넌트로 제작.
 */

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface MyPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  return (
    <MyPageContainer isOpen={isOpen} onClick={onClose}>
      <InnerContainer onClick={(e) => e.stopPropagation()}>
        <h2>마이페이지</h2>
        <button onClick={() => router.push('./myPage/account')}>계정</button>
        <button onClick={() => router.push('./myPage/plan')}>플랜</button>
      </InnerContainer>
    </MyPageContainer>
  );
};

/* ✅ MyPage 컨테이너 */
const MyPageContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  border-radius: 40px 0px 0px 40px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  width: 320px;
  height: 89vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1100;

  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
`;

const InnerContainer = styled.div`
  width: 100%;
  padding: 20px;
  text-align: center;
`;

export default MyPage;
