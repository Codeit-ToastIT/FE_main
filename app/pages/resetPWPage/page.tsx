"use client";

import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from "next/navigation";
import SubmitButton from '../../components/common/SubmitButton';
import { useEmail } from '../../context/EmailContext'; // EmailContext 가져오기

const Whole = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6rem;
  background-color: #171612;
  padding-top: 1.5rem;
  height: 100vh;
`;

const Header = styled.div`
  width: 20.5rem;
  display: inline-flex;
  margin-bottom: 4.5rem;
`;

const Title = styled.div`
  width: 20.5rem;
  color: var(--ivory, #E5DCCA);
  margin-left: 27%;
  font-family: SUIT;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem; 
`;

const Disc = styled.div`
  display: flex;
  width: 20.5rem;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;

  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  position: relative;
  width: 20.5rem; /* Input과 같은 너비 */
  margin-top: 2.5rem;
`;

const Input = styled.input`
  height: 2.5rem;
  min-width: 100%;
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  color: #E5DCCA;
  padding-left: 1rem;
  padding-right: 4rem; /* 오른쪽 여백 추가 */
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--ivory, #E5DCCA);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: SUIT;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Timer = styled.span`
  position: absolute;
  right: 1rem; 
  top: 20px; 
  transform: translateY(-50%); 
  color: #FF5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
`;

const ResendLink = styled.div`
  color: var(--ivory, #E5DCCA);
  text-align: center;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem; 
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-underline-position: from-font;
  margin-top: 0.5rem;
  cursor: pointer;
`;

const BackIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  display: flex;
  min-width: 20.5rem;
  padding: 0rem 1rem 0.5rem 1rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
  color: #FF5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.875rem; 
`;

const ResetPWPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [authCode, setAuthCode] = useState(""); // 사용자 입력값
  const [generatedCode, setGeneratedCode] = useState(""); // 생성된 6자리 숫자
  const [error, setError] = useState(""); // 에러 메시지
  const { email, setEmail: setEmailContext } = useEmail(); 
  const router = useRouter();
  
  const [countdown, setCountdown] = useState(300); // 5분 카운트다운 (300초)

  // 랜덤한 6자리 숫자 생성 및 이메일 전송
  useEffect(() => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 100000 ~ 999999
    setGeneratedCode(code);
    
    const sendCode = async () => {
      await sendEmail(code); 
    };

    sendCode(); 

    // 카운트다운 타이머 설정
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0; // 카운트다운이 끝나면 0으로 설정
        }
        return prev - 1; // 1초씩 감소
      });
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 이메일로 코드 전송
  const sendEmail = async (code: string) => {
    try {
      const response = await fetch('/api/auth/password/reset/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            email: email, // 이메일과 인증 코드를 포함
            code: code, // 생성한 인증 코드
          },
        }),
      });

      if (!response.ok) {
        throw new Error('이메일 전송에 실패했습니다.');
      }

      const data = await response.json();
      console.log(`이메일 ${data.email}로 인증번호 ${code}를 전송했습니다.`);
    } catch (error) {
      console.error(error);
    }
  };

  // BackIcon 클릭 시 이전 화면으로 이동
  const handleBackClick = () => {
    router.back();
  };

  // 재전송 버튼 클릭 시
  const handleResendClick = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 새로운 코드 생성
    setGeneratedCode(code); 
    setAuthCode(""); // 입력 필드 초기화
    setCountdown(300); // 카운트다운 초기화

    try {
      await sendEmail(code); 
      // 재전송 토스트 알림 코드 추가 필요 
    } catch (error) {
      setError("이메일 전송에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authCode === generatedCode) {
      setError("");
      setEmailContext(email); 
      router.push("/"); 
    } else {
      setError("인증번호가 일치하지 않습니다."); 
    }
  };

  // 카운트다운 시간을 분과 초로 변환하여 반환하는 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Whole>
      <Header>
      <BackIcon onClick={handleBackClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path d="M14.4 16.7998L9.59998 11.9998L14.4 7.19981" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </BackIcon>
        <Title>비밀번호 재설정</Title>
      </Header>
      <Container>
        <Disc>{email}으로</Disc>
        <Disc>인증번호를 발송했어요.</Disc>
        <InputContainer>
          <form onSubmit={handleSubmit}> 
            <Input
              type="text"
              inputMode="numeric"
              name="authCode"
              placeholder="인증번호 6자리를 입력해주세요."
              ref={inputRef}
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              autoComplete="off"
            />
            <Timer>{formatTime(countdown)}</Timer>
            {error && <ErrorMessage>{error}</ErrorMessage>} 
            <SubmitButton
              isActive={authCode.length > 0}
            />
          </form>
        </InputContainer>
        <ResendLink onClick={handleResendClick}>인증번호를 재전송할까요?</ResendLink>
      </Container>
    </Whole>
  );
};

export default ResetPWPage;

