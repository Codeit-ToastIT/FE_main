'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

import Toast from '../../components/common/toast';
import SearchBarComponent from '../../components/common/SearchBarComponent';
import BreadBox from '../../assets/load/breadbox.svg';

import Image from 'next/image.js';
import { PiCaretCircleUpDownFill } from 'react-icons/pi';
import { renderToStaticMarkup } from 'react-dom/server';

const iconString = encodeURIComponent(renderToStaticMarkup(<PiCaretCircleUpDownFill size={150} />));
const iconDataUrl = `data:image/svg+xml,${iconString}`;

interface ToastType {
  title: string;
  content: string;
  date: Date;
}

const UserToasts = {
  Category: '브랜딩 수집',
  Toasts: [
    {
      title: '제목',
      content:
        '이제 filterToast를 <TextBody>로 감싸서 렌더링할 수 있습니다. TextBody 컴포넌트는 flex 레이아웃을 사용하여 자식 요소들을 세로로 나열하고, 각 요소 간의 간격을 설정합니다.',
      date: new Date('2025-01-01'),
    },
    { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
  ] as ToastType[],
};

const LoadToastPage = () => {
  const [searchToast, setSearchToast] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchToast(e.target.value);
  };

  const filterToast = UserToasts.Toasts.filter(
    (toast) =>
      toast.content.toLowerCase().includes(searchToast.toLowerCase()) ||
      toast.title.toLowerCase().includes(searchToast.toLowerCase()),
  );
  return (
    <BackGround>
      <SearchBarComponent searchToast={searchToast} onChange={onChange} />
      <Title>{UserToasts.Category}</Title>
      <Body>
        <ScrollBar>
          {filterToast.length > 0 ? (
            <TextBody>
              {filterToast.map((toast, index) => (
                <Toast key={index} index={index} title={toast.title} content={toast.content} />
              ))}
            </TextBody>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Image src={BreadBox} alt="bread box" />
                <NoneText>브레드 박스가 비었어요.</NoneText>
              </div>
            </div>
          )}
        </ScrollBar>
      </Body>
    </BackGround>
  );
};

export default LoadToastPage;

const Title = styled.div`
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 800;
  font-size: 32px;
  line-height: 32px;
  color: #e5dcca;
  text-align: center;
  margin: 40px 0px;
`;

const Body = styled.div`
  left: 0px;
  right: 0px;
  height: calc(100vh - 200px); /* 화면 전체 높이에서 상단 요소의 높이를 뺀 값 */
  gap: 30px 0px;
  display: grid;
  background: #ffffff;
  border-radius: 20px 10px 0px 0px;
`;

const TextBody = styled.div`
  grid-template-columns: 50% 50%;
  display: grid;
  place-items: center;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
  margin: 50px 5px 100px 5px;
`;

const BackGround = styled.div`
  background-color: #806952;
`;

const NoneText = styled.div`
  font-family: 'SUIT';
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height */

  /* ivory */
  color: #e5dcca;
`;

const ScrollBar = styled.div`
  width: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 30px;
  }

  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: url(${iconDataUrl}) no-repeat;
    background-size: contain;
    border-radius: 20px;
  }

  &::-webkit-scrollbar-track {
    background: white;
    border-radius: 10px;
  }
`;
