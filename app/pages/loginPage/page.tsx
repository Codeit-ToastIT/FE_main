'use client';

import { styled } from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FocusableInput from '../../components/common/FocusableInput';
import SubmitButton from '../../components/common/SubmitButton';
import iconEyeOpen from '../../assets/icons/icon_eye_open.svg';
import iconEyeClosed from '../../assets/icons/icon_eye_closed.svg';
import { useEmail } from '../../context/EmailContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/api';

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
`;

const Title = styled.div`
  width: 20.5rem;
  color: var(--ivory, #e5dcca);
  margin-left: 35%;
  font-family: 'SUIT Variable';
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Link = styled.div`
  color: var(--ivory, #e5dcca);
  text-align: center;
  font-family: 'SUIT Variable';
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
  cursor: pointer;
`;

const IconEye = styled(Image)`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #ff5151;
  font-family: 'SUIT Variable';
  font-size: 0.875rem;
  font-weight: 400;
  margin-top: 0.5rem;
`;

const LoginPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState('');
  const isPwNotEmpty = pw.length > 0;
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { email } = useEmail();
  const { login, loginUser } = useAuth();

  // 입력 필드 포커싱
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    console.log('현재 이메일:', email);
    return () => clearTimeout(timeoutId);
  }, [email]);

  // 비밀번호 입력 시 상태 업데이트
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  };

  // BackIcon 클릭 시 이전 화면으로 이동
  const handleBackClick = () => {
    router.back();
  };

  // 폼 제출 처리
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pw) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pw }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        console.log('로그인 성공:', data);
        login(data.token); // 토큰 저장
        loginUser(data.user.id); // userId 저장
        router.push('/pages/createToastPage'); // 홈 페이지로 이동
      } else {
        setError('비밀번호를 확인해주세요.');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('로그인 오류:', error);
    }
  };

  // 비밀번호 재설정 링크 클릭 처리
  const handleLinkClick = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('인증번호 전송 성공');
        router.push('/pages/resetPasswordPage'); // 비밀번호 재설정 페이지로 이동
      } else {
        const errorData = await response.json();
        setError(errorData.message || '인증번호 전송에 실패했습니다.');
        console.error('인증번호 전송 실패:', errorData);
      }
    } catch (error) {
      setError('인증번호 전송 중 오류가 발생했습니다.');
      console.error('인증번호 전송 오류:', error);
    }
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
        <Title>로그인</Title>
      </Header>
      <Container>
        <Form noValidate onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <FocusableInput
              type={showPw ? 'text' : 'password'}
              name="password"
              placeholder="비밀번호를 입력해주세요."
              ref={inputRef}
              value={pw}
              onChange={handlePwChange}
              autoComplete="off"
            />
            <IconEye
              src={showPw ? iconEyeOpen : iconEyeClosed}
              alt={showPw ? '비밀번호 보이기' : '비밀번호 숨기기'}
              onClick={() => setShowPw((prev) => !prev)}
            />
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton isActive={isPwNotEmpty} />
        </Form>
        <Link onClick={handleLinkClick}>비밀번호를 잊어버렸나요?</Link>
      </Container>
    </Whole>
  );
};

export default LoginPage;
