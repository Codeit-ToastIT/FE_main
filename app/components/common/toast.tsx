import React from 'react';
import styled from 'styled-components';
import Image from 'next/image.js';
import burnt1 from '../../../public/burnt1.png';

interface ToastProps {
  index: number;
  title: string;
  content: string;
}

const Toast: React.FC<ToastProps> = ({ index, title, content }) => {
  return (
    <ImageWrapper key={index}>
      <Image src={burnt1} alt="burnt" layout="fixed" width={145} height={145} objectFit="cover" />
      <TextOverlay>
        <ContentText>{content}</ContentText>
      </TextOverlay>
      <TitleText>{title}</TitleText>
    </ImageWrapper>
  );
};

export default Toast;

const ImageWrapper = styled.div`
  position: relative;
  height: auto;
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

  font-family: 'SUIT';
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 12px;
  /* or 109% */

  /* mocha category */
  color: #501500;

  mix-blend-mode: plus-darker;
  /* burnt_text */

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 1;
`;

const TitleText = styled.div`
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  /* or 125% */
  text-align: center;
  color: black;
`;
