'use client';

import { styled } from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import FocusableInput from '../../components/common/FocusableInput';
import SubmitButton from '../../components/common/SubmitButton';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import iconEyeOpen from '../../assets/icons/icon_eye_open.svg';
import iconEyeClosed from '../../assets/icons/icon_eye_closed.svg';
import Image from 'next/image';

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
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  margin-left: 27%;
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

const BackIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  color: #ff5151;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem;
  padding-left: 1rem;
`;

const EyeIcon = styled(Image)`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: 1rem; /* 오른쪽 여백 */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
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
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; /* 114.286% */
  opacity: 0; /* 기본값 */
  transition: opacity 0.3s ease-in-out;
  z-index: 1000;
`;

const ResetPasswordForm = () => {
  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const isPwValid = pw.length >= 8; // 비밀번호 유효성 체크
  const router = useRouter();
  const [showPw, setShowPw] = useState(false); // 비밀번호 보이기 상태
  const [showPwCheck, setShowPwCheck] = useState(false); // 비밀번호 확인 보이기 상태
  const { token } = useAuth();
  const [toastVisible, setToastVisible] = useState(false); // 토스트 가시성
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지
  // 입력 필드 포커싱
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef1.current) {
        inputRef1.current.focus(); // 첫 번째 입력 필드에 포커스
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault(); // 기본 동작 방지
    (event.target as HTMLInputElement).focus(); // 클릭한 입력 필드에 포커스
  };

  // 비밀번호 입력 시 상태 업데이트
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPw = e.target.value;
    setPw(newPw);

    // 비밀번호가 8자리를 초과하는 경우 영소문자와 숫자 조합 체크
    if (newPw.length > 8) {
      const hasLowerCase = /[a-z]/.test(newPw);
      const hasNumber = /\d/.test(newPw);

      if (!hasLowerCase || !hasNumber) {
        setErrorMessage('영소문자와 숫자 조합을 입력해주세요.'); // 오류 메시지 설정
      } else {
        setErrorMessage(''); // 오류 메시지 초기화
      }
    } else {
      setErrorMessage(''); // 비밀번호가 8자리가 안 될 경우 오류 메시지 초기화
    }
  };

  // 비밀번호 확인 입력 시 상태 업데이트
  const handlePwCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPwCheck = e.target.value;
    setPwCheck(newPwCheck);

    // 비밀번호 확인 입력이 시작될 때부터 확인
    if (newPwCheck.length > 0) {
      if (newPwCheck !== pw) {
        setErrorMessage('비밀번호가 서로 달라요.'); // 비밀번호 불일치 오류 메시지 설정
      } else {
        setErrorMessage(''); // 비밀번호가 같을 때 오류 메시지 초기화
      }
    }
  };

  // BackIcon 클릭 시 이전 화면으로 이동
  const handleBackClick = () => {
    router.back(); // 이전 페이지로 이동
  };

  // 비밀번호 재설정 API 호출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: pw,
          confirmPassword: pwCheck,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || '비밀번호 재설정에 실패했습니다.');
        return;
      }

      setToastMessage('비밀번호가 변경되었습니다.');
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false); // Toast 숨기기
      }, 800);
      setTimeout(() => {
        router.push('/pages/emailInputPage');
      });
    } catch (error) {
      setErrorMessage('비밀번호 재설정 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <Whole onMouseDown={handleMouseDown}>
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
        <Form noValidate onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <FocusableInput
              type={showPw ? 'text' : 'password'} // 비밀번호 타입 전환
              name="password"
              placeholder="8자리 이상의 비밀번호를 입력해주세요."
              ref={inputRef1}
              value={pw}
              onChange={handlePwChange} // 비밀번호 상태 업데이트
              autoComplete="off"
            />
            <EyeIcon
              src={showPw ? iconEyeOpen : iconEyeClosed}
              alt={showPw ? '비밀번호 보이기' : '비밀번호 숨기기'}
              onClick={() => setShowPw((prev) => !prev)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <FocusableInput
              type={showPwCheck ? 'text' : 'password'} // 비밀번호 확인 타입 전환
              name="passwordCheck"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              ref={inputRef2}
              value={pwCheck}
              onChange={handlePwCheckChange}
              autoComplete="off"
            />
            <EyeIcon
              src={showPwCheck ? iconEyeOpen : iconEyeClosed}
              alt={showPwCheck ? '비밀번호 보이기' : '비밀번호 숨기기'}
              onClick={() => setShowPwCheck((prev) => !prev)}
            />
          </div>
          {!isPwValid && <ErrorMessage>아직 8자리가 아니에요.</ErrorMessage>}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <SubmitButton isActive={isPwValid && pw === pwCheck} />
        </Form>
      </Container>
      <Toast
        style={{ display: toastVisible ? 'inline-flex' : 'none', opacity: toastVisible ? 1 : 0 }}
      >
        {toastMessage}
      </Toast>
    </Whole>
  );
};

export default ResetPasswordForm;
