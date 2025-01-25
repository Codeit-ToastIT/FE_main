'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import Toast from '@/app/components/common/BasicToast';
import BreadBox from '../../../public/Group 7.svg';
import Image from 'next/image.js';
import { LuChevronsUpDown } from 'react-icons/lu';

interface ToastType {
  title: string;
  content: string;
  date: Date;
}

const UserToasts = {
  Category: '브랜딩 수집',
  Toasts: [
    // {
    //   title: '제목',
    //   content:
    //     '이제 filterToast를 <TextBody>로 감싸서 렌더링할 수 있습니다. TextBody 컴포넌트는 flex 레이아웃을 사용하여 자식 요소들을 세로로 나열하고, 각 요소 간의 간격을 설정합니다.',
    //   date: new Date('2025-01-01'),
    // },
    // { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    // { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    // { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    // { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    // { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
    // { title: '제목', content: '어쩌구', date: new Date('2025-01-01') },
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
      <SearchComponent>
        <BackButton>
          <IoIosArrowBack className="back" />
        </BackButton>
        <SearchBar placeholder="검색어를 입력해주세요" onChange={onChange} value={searchToast} />
        <FiSearch className="glasses" size={22} />
      </SearchComponent>
      <Title>{UserToasts.Category}</Title>
      <Body>
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
        <ScrollComponent>
          <LuChevronsUpDown className="scroll" size={22} />
        </ScrollComponent>
      </Body>
    </BackGround>
  );
};

export default LoadToastPage;

const SearchBar = styled.input`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #171612;
  border-radius: 40px;
  border-width: 0;
  padding: 13px;
  width: 303px;

  &::placeholder {
    font-family: 'SUIT';
    font-style: normal;
    font-weight: 800;
    font-size: 16px;

    display: flex;
    align-items: center;
    opacity: 0.2;
  }
  color: #e5dcca;
`;

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

  padding: 30px 10px 110px 10px;
  ::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 엣지 */
  }
  scrollbar-width: none; /* Firefox */
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
`;

const TextBody = styled.div`
  grid-template-columns: 50% 50%;
  display: grid;
  place-items: center;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
`;

const BackGround = styled.div`
  background-color: #806952;
`;

const SearchComponent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .back {
    color: #e5dcca;
  }
  .glasses {
    color: #e5dcca;
    position: absolute;
    right: 9em;
  }
`;

const BackButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  /* black */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #171612;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ScrollComponent = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  position: absolute;
  right: 7em;
  /* black */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #171612;
  display: flex;
  justify-content: center;
  align-items: center;
  .scroll {
    color: #e5dcca;
  }
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
