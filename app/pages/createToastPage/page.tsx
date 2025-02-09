/**
 * 파일명: createToastPage/page.tsx
 * 작성일: 2025-02-08
 * 작성자: 이서연
 * 설명: 회원가입 시 온보딩 1회 구현 완료
 */

'use client';

import dynamic from 'next/dynamic';

// 클라이언트에서만 렌더링되도록 설정
const CreateToastComponent = dynamic(() => import('./CreateToastComponent'), { ssr: false });

const CreateToastPage = () => {
  return <CreateToastComponent />;
};

export default CreateToastPage;
