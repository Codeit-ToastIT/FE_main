"use client";

import { styled } from "styled-components";
import React, { useEffect, useRef, useState } from "react";

const Whole = styled.div`
display: inline-flex;
flex-direction: column;
align-items: center;
gap: 6rem;
background-color: #171612;
padding-top: 5rem;
height: 100vh;
`;

const Title = styled.div`
width: 20.5rem;
color: var(--ivory, #E5DCCA);
font-family: SUIT;
font-size: 1.5rem;
font-weight: 800;
line-height: 1.5rem;
`;

const Container = styled.div`
display: flex;
width: 23.4375rem;
min-width: 20.5rem;
padding: 0rem 1.5rem 0rem 1.4375rem;
flex-direction: column;
align-items: center;
`;

const Input = styled.input`
height: 2.5rem;
min-width: 20.5rem;
align-self: stretch;
border-radius: 2.5rem;
background: rgba(255, 255, 255, 0.2);
border: none;
outline: none;
color: #E5DCCA;
padding-left: 1rem;
font-weight: 600;
`;

const Submit = styled.input<{ isActive: boolean }>`
  display: flex;
  height: 2.5rem;
  min-width: 20.5rem;
  padding: 0.5rem 1.25rem;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 2.5rem;
  border: 1px solid var(--ivory, #E5DCCA);
  background-color: ${({ isActive }) => (isActive ? '#E5DCCA' : 'transparent')}; /* 색상 변경 */
  color: ${({ isActive }) => (isActive ? '#171612' : '#E5DCCA')};
  opacity: ${({ isActive }) => (isActive ? '1' : '0.2')};
  font-weight: 800;
`;

const ErrorMessage = styled.div`
color: #FF5151;
font-family: SUIT;
font-size: 0.75rem;
font-style: normal;
font-weight: 400;
line-height: 0.875rem;
padding-left: 1rem;
`;

const Form = styled.form`
display: flex;
flex-direction: column;
gap: 0.5rem;
`;

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState(""); // 이메일 상태
  const [error, setError] = useState(""); // 오류 메시지 상태
  const isEmailNotEmpty = email.length > 0; // 이메일 입력 여부

  // 입력 필드 포커싱 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // 입력 필드에 포커스
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault(); // 기본 동작 방지
    inputRef.current?.focus(); // 입력 필드에 포커스
  };


  // 이메일 유효성 검사 
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // 기본 제출 동작 방지
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규 표현식

    if (!emailPattern.test(email)) {
      setError("이메일 형식을 확인해주세요."); // 오류 메시지 설정
    } else {
      setError(""); // 오류 메시지 초기화
      // 여기에 폼 제출 로직 추가
      console.log("이메일 제출:", email);
    }
  };

  // 이메일 입력 시 상태 업데이트
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); // 이메일 상태 업데이트
  };

  return (
    <Whole onMouseDown={handleMouseDown}>
      <Title>어서오세요.</Title>
      <Container>
        <Form onSubmit={handleSubmit} noValidate>
          <Input
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요."
            ref={inputRef}
            value={email}
            onChange={handleEmailChange} // 이메일 상태 업데이트
            onInvalid={() => setError("유효한 이메일 주소를 입력해주세요.")}
            autoComplete="off"
          />
          {error && <ErrorMessage>{error}</ErrorMessage>} {/* 오류 메시지 표시 */}
          <Submit type="submit" value="계속하기"  isActive={isEmailNotEmpty} disabled={!isEmailNotEmpty}/>
        </Form>
      </Container>
    </Whole>
  );
}

