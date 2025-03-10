import React from 'react';
import styled from 'styled-components';
import Image from 'next/image.js';
import burnt1 from '../../../public/toasts/burnt1.png';

interface ToastProps {
  index: number;
  title: string;
  content: string;
  onClick: () => void; // onClick 속성 추가
}

const BurntToast: React.FC<ToastProps> = ({ index, title, content, onClick }) => {
  return (
    <ImageWrapper key={index} onClick={onClick}>
      {' '}
      {/* onClick 이벤트 핸들러 추가 */}
      <Image src={burnt1} alt="burnt" layout="fixed" width={145} height={145} objectFit="cover" />
      <TextOverlay>
        <ContentText>{content}</ContentText>
      </TextOverlay>
      <TitleText>{title}</TitleText>
    </ImageWrapper>
  );
};

export default BurntToast;

const ImageWrapper = styled.div`
  position: relative;
  height: auto;
  cursor: pointer; /* 클릭 가능한 커서 추가 */
  ::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 엣지 */
  }
  scrollbar-width: none; /* Firefox */
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 60%;
  width: 70%; /* 고정된 너비 */
  overflow-y: hidden;
  text-align: left;
  table-layout: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white; /* 텍스트 색상 */
  margin: 20px;
`;

const ContentText = styled.div`
  width: 104px;
  height: 120px;

  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 120%;
  /* or 109% */

  /* mocha category */
  color: #501500;
  text-shadow: 0px 0px 4px rgba(128, 105, 82, 0.4);
  mix-blend-mode: plus-darker;
  /* burnt_text */

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 1;
`;

const TitleText = styled.div`
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  /* or 125% */
  text-align: center;
  color: black;
  margin-bottom: 10px;
`;
