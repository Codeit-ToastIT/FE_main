'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SubmitButton from '../../../../components/common/SubmitButton';

import iconEyeOpen from '../../../../assets/icons/icon_eye_open.svg';
import iconEyeClosed from '../../../../assets/icons/icon_eye_closed.svg';
import { API_BASE_URL } from '../../../../api/api';
import { useEmail } from '../../../../context/EmailContext';

const Whole = styled.div<{ fadeIn: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6rem;
  background-color: #171612;
  padding-top: 1.5rem;
  height: 100vh;
  opacity: ${({ fadeIn }) => (fadeIn ? 1 : 0)};
  transition: opacity 0.1s ease-in-out;
`;

const Header = styled.div`
  width: 20.5rem;
  display: inline-flex;
`;

const Title = styled.div`
  width: 20.5rem;
  color: var(--ivory, #e5dcca);
  margin-right: 7%;
  text-align: center;

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

const Input = styled.input`
  height: 2.5rem;
  min-width: 20.5rem;
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  padding-left: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ivory, #e5dcca);

  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
`;

const Link = styled.div`
  color: var(--ivory, #e5dcca);
  text-align: center;

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

const CurrentPassword = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState('');
  const isPwNotEmpty = pw.length > 0;
  const router = useRouter();
  const { email } = useEmail();
  const [error, setErrorMessage] = useState('');
  const [showPw, setShowPw] = useState(false);

  // fadeIn 상태: 마운트 후 true로 설정하여 fade-in 효과 발생
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // 입력 필드 포커싱
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    inputRef.current?.focus();
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || '현재 비밀번호가 올바르지 않습니다.');
        return;
      }
      // 로그인 성공 -> 현재 비밀번호가 올바르다는 뜻
      localStorage.setItem('currentPassword', pw);
      router.push('../account/changePassword');
    } catch (error) {
      setErrorMessage('현재 비밀번호 확인 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

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
        router.push('/pages/resetPasswordPage');
      } else {
        const errorData = await response.json();
        console.error('인증번호 전송 실패:', errorData);
      }
    } catch (error) {
      console.error('인증번호 전송 오류:', error);
    }
  };

  // 기존의 onClick={() => setShowPw((prev) => !prev)} 대신
  const handleToggleShowPw = () => {
    if (inputRef.current) {
      const caretPos = inputRef.current.selectionStart;
      setShowPw((prev) => !prev);
      // 상태 변경 후, 바로 커서 위치를 복원 (타이밍 문제를 피하기 위해 setTimeout 사용)
      setTimeout(() => {
        if (inputRef.current && caretPos !== null) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(caretPos, caretPos);
        }
      }, 0);
    } else {
      setShowPw((prev) => !prev);
    }
  };

  return (
    <Whole fadeIn={fadeIn} onMouseDown={handleMouseDown}>
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
        <Title>기존 비밀번호 입력</Title>
      </Header>
      <Container>
        <Form noValidate onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <Input
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
              onClick={handleToggleShowPw}
            />
          </div>
          {error && (
            <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</div>
          )}
          <SubmitButton isActive={isPwNotEmpty} />
        </Form>
        <Link onClick={handleLinkClick}>비밀번호를 잊어버렸나요?</Link>
      </Container>
    </Whole>
  );
};

export default CurrentPassword;
