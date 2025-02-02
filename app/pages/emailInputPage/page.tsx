"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmail } from '../../context/EmailContext';
import styled from 'styled-components';

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

const Input = styled.input`
  height: 2.5rem;
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  color: #E5DCCA;
  padding-left: 1rem;
  font-weight: 600;
`;

const Submit = styled.input.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop)
})<{ isActive: boolean }>`
  height: 2.5rem;
  min-width: 20.5rem;
  border-radius: 2.5rem;
  border: 1px solid var(--ivory, #E5DCCA);
  background-color: ${({ isActive }) => (isActive ? '#E5DCCA' : 'transparent')};
  color: ${({ isActive }) => (isActive ? '#171612' : '#E5DCCA')};
  opacity: ${({ isActive }) => (isActive ? '1' : '0.2')};
  font-weight: 800;
`;

const ErrorMessage = styled.div`
  color: #FF5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem;
  padding-left: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EmailInputPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState(""); // 이메일 상태
  const [error, setError] = useState(""); // 오류 메시지 상태
  const isEmailNotEmpty = email.length > 0; // 이메일 입력 여부
  const router = useRouter();
  const { setEmail: setEmailContext } = useEmail(); // EmailContext에서 setEmail 가져오기

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

  // 이메일 유효성 검사 및 제출
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 제출 동작 방지
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규 표현식

    if (!emailPattern.test(email)) {
      setError("이메일 형식을 확인해주세요."); // 오류 메시지 설정
    } else {
      setError(""); // 오류 메시지 초기화
      setEmailContext(email); // 이메일 상태 업데이트

      // 이메일 등록 여부 확인 API 호출
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        if (data.exists) {
          router.push('/pages/loginPage');
        } else {
          router.push('/pages/signupPage');
        }
      } catch (error) {
        console.error('이메일 확인 중 오류 발생', error);
      }
    }
  };

  // 이메일 입력 시 상태 업데이트
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Whole onMouseDown={handleMouseDown}>
      <Title>어서오세요.</Title>
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
        <Submit type="submit" value="계속하기" isActive={isEmailNotEmpty} disabled={!isEmailNotEmpty} />
      </Form>
    </Whole>
  );
};

export default EmailInputPage;
