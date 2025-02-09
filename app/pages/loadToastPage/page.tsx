'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import BurntToast from '../../components/common/BurntToast';
import SearchBarComponent from '../../components/common/SearchBarComponent';
import BreadBox from '../../assets/load/breadbox.svg';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/api';

import Image from 'next/image.js';
import { PiCaretCircleUpDownFill } from 'react-icons/pi';
import { renderToStaticMarkup } from 'react-dom/server';

const iconString = encodeURIComponent(renderToStaticMarkup(<PiCaretCircleUpDownFill size={150} />));
const iconDataUrl = `data:image/svg+xml,${iconString}`;

interface ToastType {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const LoadToastPage: React.FC = () => {
  const [searchToast, setSearchToast] = useState<string>('');
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const router = useRouter();
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchToasts = async () => {
      try {
        if (!token) {
          console.error('인증 토큰이 필요합니다.');
          return;
        }
        const apiUrl = `${API_BASE_URL}/api/categories/${category}/memos`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`❌ 서버 응답 오류: ${errorData}`);
          throw new Error('❌ 토스트 가져오기 실패');
        }

        const data = await response.json();
        setToasts(data.notes);
        setCategoryName(data.category.name);
        console.log('서버 연결 성공');
      } catch (error) {
        console.error('Error fetching toasts:', error);
      }
    };

    if (category) {
      fetchToasts();
    }
  }, [token, category]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchToast(e.target.value);
  };

  const handleToastClick = (id: number) => {
    router.push(`editToastPage?id=${id}`);
  };

  const filterToast = toasts.filter(
    (toast) =>
      toast.content.toLowerCase().includes(searchToast.toLowerCase()) ||
      toast.title.toLowerCase().includes(searchToast.toLowerCase()),
  );

  return (
    <BackGround>
      <SearchBarComponent searchToast={searchToast} onChange={onChange} />
      <Title>{categoryName}</Title>
      <Body>
        <ScrollBar>
          {filterToast.length > 0 ? (
            <TextBody>
              {filterToast.map((toast) => (
                <BurntToast
                  key={toast.id}
                  index={toast.id}
                  title={toast.title}
                  content={toast.content}
                  onClick={() => handleToastClick(toast.id)} // 클릭 이벤트 핸들러 추가
                />
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
