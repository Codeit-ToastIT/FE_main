/**
 * 파일명: home.tsx
 * 작성일: 2025-01-18
 * 작성자: 이서연
 * 설명: home 화면 구현.
 */

import React from 'react';
import Header from '../../components/layout/header';
import Body from '../../components/common/body';

const Home: React.FC = () => {
  return (
    <div>
      <Header title="TOAST IT" />
      <Body />
    </div>
  );
};

export default Home;
