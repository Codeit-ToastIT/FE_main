/**
 * 파일명: page.tsx
 * 작성일: 2025-02-01
 * 작성자: 이유진
 * 설명: 플랜 페이지 구현.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const PlanPage = () => {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <StyledImage src="/icon_back.svg" alt="뒤로 가기" />
        </BackButton>
        <TitleWrapper>
          <TitleContainer>
            <Title>플랜</Title>
          </TitleContainer>
        </TitleWrapper>
      </Header>

      <PlanContainer>
        <PlanBox>
          <PlanTitle>플랜A 이름</PlanTitle>
          <PlanPrice>free</PlanPrice>
          <PlanFeature>✔ 4개의 브레드박스에 저장 가능</PlanFeature>
          <PlanButton disabled>플랜A 구독 중</PlanButton>
        </PlanBox>

        <PlanBox>
          <PlanTitle>플랜B 이름</PlanTitle>
          <PlanPrice>매달 ₩0,000</PlanPrice>
          <PlanFeature>✔ 8개의 브레드박스에 저장 가능</PlanFeature>
          <PlanFeature>✔ 제목 자동 완성 인공지능</PlanFeature>
          <PlanButton>플랜B 구독하기</PlanButton>
        </PlanBox>
      </PlanContainer>
    </Container>
  );
};

export default PlanPage;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: var(--ivory, #e5dcca);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 343px;
  display: flex;
  align-items: center;
  background-color: transparent;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 원형 버튼 */
  background-color: #000;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const TitleContainer = styled.div`
  flex: 1;
  background-color: #000;
  border-radius: 24px; /* 둥근 사각형 */
  padding: 8.67px 20px;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 18px;
  color: #f5e8d6;
  font-weight: bold;
  margin: 0;
`;

const PlanContainer = styled.div`
  width: 343px;
  margin-top: 20px;
`;

const PlanBox = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 40px;
  padding: 20px;
  margin-bottom: 15px;
`;

const PlanTitle = styled.h2`
  color: var(--black, #171612);
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 20px; /* 125% */
`;

const PlanPrice = styled.p`
  color: var(--caramel, #974b00);
  font-family: SUIT;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  margin: 0;
`;

const PlanFeature = styled.p`
  color: var(--black, #171612);
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  margin: 8px 0;
`;

const PlanButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  background-color: ${(props) => (props.disabled ? 'transparent' : '#806952')};
  color: ${(props) => (props.disabled ? '#E5DCCA' : '#fff')};
  border: ${(props) => (props.disabled ? '1px solid #E5DCCA' : 'none')};
  font-weight: ${(props) => (props.disabled ? 'none' : 'bold')};
  border-radius: 40px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

const StyledImage = styled(Image)``;
