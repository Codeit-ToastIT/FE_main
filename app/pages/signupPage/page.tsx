'use client';

import { styled } from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmail } from '../../context/EmailContext';
import { useAuth } from '../../context/AuthContext';
import FocusableInput from '../../components/common/FocusableInput';
import SubmitButton from '../../components/common/SubmitButton';

import { API_BASE_URL } from '../../api/api';
import Image from 'next/image';
import iconEyeOpen from '../../assets/icons/icon_eye_open.svg';
import iconEyeClosed from '../../assets/icons/icon_eye_closed.svg';

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
  font-family: SUIT;
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

const BackIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  color: #ff5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem;
  padding-left: 1rem;
`;

const SuccessMessage = styled.div`
  color: #51FFB9;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem;
  padding-left: 1rem;  
`

const EyeIcon = styled(Image)`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: 1rem; /* 오른쪽 여백 */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const SignupPage = () => {
  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);

  const { email } = useEmail();
  const { login, loginUser, signupMessage } = useAuth();
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isPwValid = pw.length >= 8; // 비밀번호 유효성 체크
  const router = useRouter();
  const [showPw, setShowPw] = useState(false); // 비밀번호 보이기 상태
  const [showPwCheck, setShowPwCheck] = useState(false); // 비밀번호 확인 보이기 상태

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
        setSuccessMessage('비밀번호가 서로 일치해요.');
      }
    }
  };

  // BackIcon 클릭 시 이전 화면으로 이동
  const handleBackClick = () => {
    router.back(); // 이전 페이지로 이동
  };

  // 회원가입 요청
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 방지

    if (pw.length < 8) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.');
      return; // 비밀번호가 유효하지 않으면 함수 종료
    }

    if (pw !== pwCheck) {
      setErrorMessage('비밀번호가 서로 달라요.');
      return; // 비밀번호가 다르면 함수 종료
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: pw,
          confirmPassword: pwCheck,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || '회원가입에 실패했습니다.');
        return; // 에러 발생 시 함수 종료
      }

      const data = await response.json(); // 응답 데이터 파싱
      console.log(data);
      signupMessage(data.message);

      // 회원가입 성공 시 사용자 정보를 사용하여 로그인 처리
      if (data.user) {
        // 로그인 상태 업데이트 (예: Context API 사용)
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: pw }),
          });

          const data = await response.json();

          if (response.ok) {
            console.log('로그인 성공:', data);
            // 로그인 성공 후 토큰 저장 및 홈 페이지로 이동
            login(data.token); // 토큰 저장
            loginUser(data.user.id); // userId 저장
            router.push('/pages/createToastPage'); // 홈 페이지로 이동
          }
        } catch (error) {
          console.error('로그인 오류:', error);
        }
      } else {
        setErrorMessage('사용자 정보가 없습니다.'); // 사용자 정보가 없는 경우 처리
      }
    } finally {
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
        <Title>회원가입</Title>
      </Header>
      <Container>
        <Form noValidate onSubmit={handleSignup}>
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
              onClick={() => setShowPw((prev) => !prev)}
              src={showPw ? iconEyeOpen : iconEyeClosed}
              alt={showPw ? '비밀번호 보이기' : '비밀번호 숨기기'}
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
              onClick={() => setShowPwCheck((prev) => !prev)}
              src={showPwCheck ? iconEyeOpen : iconEyeClosed}
              alt={showPwCheck ? '비밀번호 보이기' : '비밀번호 숨기기'}
            />
          </div>
          {!isPwValid && <ErrorMessage>아직 8자리가 아니에요.</ErrorMessage>}{' '}
          {/* 오류 메시지 조건부 렌더링 */}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} {/* 오류 메시지 표시 */}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          <SubmitButton isActive={isPwValid && pw === pwCheck} />
        </Form>
      </Container>
    </Whole>
  );
};
export default SignupPage;
