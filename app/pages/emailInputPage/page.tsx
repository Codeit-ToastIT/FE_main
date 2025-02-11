'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmail } from '../../context/EmailContext';
import styled from 'styled-components';
import { API_BASE_URL } from '../../api/api';
import SubmitButton from '../../components/common/SubmitButton';

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
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.5rem;
`;

const Input = styled.input`
  height: 2.5rem;
  min-width: 20.5rem;
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  color: #e5dcca;
  padding-left: 1rem;
  overflow: hidden;
  color: var(--ivory, #e5dcca);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: SUIT;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ErrorMessage = styled.div`
  color: #ff5151;
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

  const [email, setEmail] = useState(''); // 이메일 상태
  const [error, setError] = useState(''); // 오류 메시지 상태
  const isEmailNotEmpty = email.length > 0; // 이메일 입력 여부 확인
  const router = useRouter();
  const { setEmail: setEmailContext } = useEmail(); // EmailContext에서 setEmail 가져오기

  // 자동 로그인 확인
  useEffect(() => {
    
    const checkAutoLogin = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/restore`, {
          method: 'GET',
          credentials: 'include', // 쿠키를 포함한 요청
        });

        if (response.ok) {
          // 토큰이 유효한 경우 홈 화면으로 이동
          router.push('/pages/createToastPage');
        } 
      } catch (error) {
        console.error('자동 로그인 확인 중 오류 발생:', error);
      }
    };

    checkAutoLogin();
  }, [router]);

  // 컴포넌트가 마운트될 때 입력 필드에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 마우스 클릭 시 커서 이동
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault(); // 기본 동작 방지

    const input = inputRef.current;
    if (input) {
      const { offsetX } = event.nativeEvent; // 클릭한 위치의 X 좌표
      const clickedPosition = getCursorPosition(input, offsetX); // 커서 위치 계산

      input.focus();
      input.setSelectionRange(clickedPosition, clickedPosition); // 커서 위치 설정
    }
  };

  // 클릭한 위치에 해당하는 커서 위치 계산
  const getCursorPosition = (input: HTMLInputElement, offsetX: number) => {
    const value = input.value;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return 0;

    // 입력 필드의 폰트 스타일 가져오기
    const font = window.getComputedStyle(input).font;
    context.font = font;

    // 평균 문자 너비 계산
    const textWidth = context.measureText(value).width;
    const averageCharWidth = textWidth / value.length;

    // 클릭한 위치에 해당하는 문자 인덱스 계산
    return Math.round(offsetX / averageCharWidth);
  };

  // 포커스를 잃을 때 다시 포커스
  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 제출 동작 방지
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규 표현식

    // 이메일 형식 검사
    if (!emailPattern.test(email)) {
      setError('이메일 형식을 확인해주세요.'); // 오류 메시지 설정
    } else {
      setError(''); // 오류 메시지 초기화
      setEmailContext(email); // 이메일 상태 업데이트

      // 이메일 등록 여부 확인 API 호출
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json(); // 오류 메시지 파싱
          setError(errorData.message); // 오류 메시지 설정
          return;
        }

        const data = await response.json(); // 응답 데이터 파싱

        console.log(data);
        // 이메일 존재 여부에 따라 라우팅
        if (data.exists) {
          router.push('/pages/loginPage');
        } else {
          router.push('/pages/signupPage');
        }
      } catch (error) {
        console.error('이메일 확인 중 오류 발생', error); // 오류 로깅
        setError('이메일 확인 중 오류가 발생했습니다.'); // 사용자에게 오류 메시지 설정
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
          type="text"
          name="email"
          placeholder="이메일을 입력해주세요."
          ref={inputRef}
          value={email}
          onChange={handleEmailChange} // 이메일 상태 업데이트
          onInvalid={() => setError('유효한 이메일 주소를 입력해주세요.')}
          autoComplete="off"
          onBlur={handleBlur} // 포커스를 잃을 때 다시 포커스
        />
        {error && <ErrorMessage>{error}</ErrorMessage>} {/* 오류 메시지 표시 */}
        <SubmitButton isActive={isEmailNotEmpty} />
      </Form>
    </Whole>
  );
};

export default EmailInputPage;