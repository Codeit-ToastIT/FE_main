'use client';

import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';
import SubmitButton from '../../components/common/SubmitButton';
import { useEmail } from '../../context/EmailContext'; // EmailContext 가져오기
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const Whole = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
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
  color: var(--ivory, #e5dcca);
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

  color: var(--ivory, #e5dcca);
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
  width: 20.5rem;
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  color: #e5dcca;
  padding-left: 1rem;
  padding-right: 4rem; /* 오른쪽 여백 추가 */
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--ivory, #e5dcca);
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
  color: #ff5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
`;

const ResendLink = styled.div`
  color: var(--ivory, #e5dcca);
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
  color: #ff5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.875rem;
`;

const Toast = styled.div`
  padding: 0.75rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 2.5rem;
  background: rgba(229, 220, 202, 0.2);
  color: var(--ivory, #e5dcca);
  margin-top: 2.37rem;
  text-align: center;
  font-family: SUIT;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; /* 114.286% */
  opacity: 0; /* 기본값 */
  transition: opacity 0.3s ease-in-out;
  z-index: 1000;
`;

// Props 타입 정의
interface EmailVerificationProps {
  onSuccess: () => void; // onSuccess는 매개변수가 없는 함수
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onSuccess }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [authCode, setAuthCode] = useState(''); // 사용자 입력값
  const [error, setError] = useState(''); // 에러 메시지
  const { email } = useEmail();
  const router = useRouter();
  const [countdown, setCountdown] = useState(300); // 5분 카운트다운 (300초)
  const [toastVisible, setToastVisible] = useState(false); // 토스트 가시성
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지
  const { login } = useAuth();


  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    console.log('현재 이메일:', email);
    return () => clearInterval(timer);
  }, []); // email 의존성 제거
  // BackIcon 클릭 시 이전 화면으로 이동
  const handleBackClick = () => {
    router.back();
  };

  // 재전송 버튼 클릭 시
  const handleResendClick = async () => {
    setAuthCode('');
    setCountdown(300);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setToastMessage('인증번호가 재전송되었습니다.');
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
        }, 800);
      } else {
        const errorData = await response.json();
        setError(errorData.message || '이메일 전송에 실패했습니다.');
        console.error('이메일 전송 실패:', errorData);
      }
    } catch (error) {
      setError('이메일 전송 중 오류가 발생했습니다.');
      console.error('이메일 전송 오류:', error);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code: authCode,
      }),
    });

    if (response.ok) {
      onSuccess();
      const data = await response.json();
      console.log(data);
      login(data.token);
    } else {
      const errorData = await response.json();
      setError(errorData.message || '인증번호가 일치하지 않습니다.');
      console.error('인증 실패:', errorData);
    }
  } catch (error) {
    setError('인증 중 오류가 발생했습니다.');
    console.error('인증 오류:', error);
  }
};

  // 카운트다운 시간 -> 분과 초로 변환
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Whole>
      <Header>
        <BackIcon
          onClick={handleBackClick}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M14.4 16.7998L9.59998 11.9998L14.4 7.19981"
            stroke="#E5DCCA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
            <SubmitButton isActive={authCode.length > 0} />
          </form>
        </InputContainer>
        <ResendLink onClick={handleResendClick}>인증번호를 재전송할까요?</ResendLink>
      </Container>
      <Toast
        style={{ display: toastVisible ? 'inline-flex' : 'none', opacity: toastVisible ? 1 : 0 }}
      >
        {toastMessage}
      </Toast>
    </Whole>
  );
};

export default EmailVerification;
