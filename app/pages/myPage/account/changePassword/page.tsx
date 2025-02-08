"use client";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../api/api";
import { useAuth } from '../../../../context/AuthContext';
import SubmitButton from '../../../../components/common/SubmitButton';

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
  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
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

const Input = styled.input`
  height: 2.5rem;
  min-width: 20.5rem;
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  color: #E5DCCA;
  padding-left: 1rem;
  font-weight: 600;
`;

const BackIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  color: #FF5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem;
  padding-left: 1rem;
`;

const EyeIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const ChangePassword = () => {
  const { token } = useAuth();
  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState(""); 
  const [pwCheck, setPwCheck] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const isPwValid = pw.length >= 8; // 비밀번호 유효성 체크
  const router = useRouter();
  const [showPw, setShowPw] = useState(false); // 비밀번호 보이기 상태
  const [showPwCheck, setShowPwCheck] = useState(false); // 비밀번호 확인 보이기 상태

  // 페이지 로드시 이전 페이지에서 저장한 currentPassword가 있는지 확인
  useEffect(() => {
    const storedCurrentPassword = localStorage.getItem("currentPassword");
    if (!storedCurrentPassword) {
      setErrorMessage("현재 비밀번호 정보가 없습니다.");
      // 필요에 따라 이전 페이지로 이동시킬 수도 있음.
    }
    // 포커스 설정 (첫 번째 입력 필드)
    const timeoutId = setTimeout(() => {
      if (inputRef1.current) {
        inputRef1.current.focus();
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    (event.target as HTMLInputElement).focus();
  };
  
  // 비밀번호 입력 시 상태 업데이트
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPw = e.target.value;
    setPw(newPw); 

    if (newPw.length > 8) {
      const hasLowerCase = /[a-z]/.test(newPw);
      const hasNumber = /\d/.test(newPw);
      if (!hasLowerCase || !hasNumber) {
        setErrorMessage("영소문자와 숫자 조합을 입력해주세요.");
      } else {
        setErrorMessage("");
      }
    } else {
      setErrorMessage("");
    }
  };

  // 비밀번호 확인 입력 시 상태 업데이트
  const handlePwCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPwCheck = e.target.value;
    setPwCheck(newPwCheck);
    if (newPwCheck.length > 0 && newPwCheck !== pw) {
      setErrorMessage("비밀번호가 서로 달라요.");
    } else {
      setErrorMessage("");
    }
  };

  // BackIcon 클릭 시 이전 화면으로 이동
  const handleBackClick = () => {
    router.back();
  };

  // 비밀번호 변경 API 호출 (세 값 모두 전송)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPassword = localStorage.getItem("currentPassword");
    if (!currentPassword) {
      setErrorMessage("현재 비밀번호 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password/change`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword, 
          newPassword: pw,
          confirmPassword: pwCheck,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "비밀번호 변경에 실패했습니다.");
        return;
      }
      // API 호출 성공 시 임시 저장된 currentPassword 삭제
      localStorage.removeItem("currentPassword");
      router.push('../');
    } catch (error) {
      setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <Whole onMouseDown={handleMouseDown}>
      <Header>
        <BackIcon onClick={handleBackClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path d="M14.4 16.7998L9.59998 11.9998L14.4 7.19981" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </BackIcon>
        <Title>새로운 비밀번호 입력</Title>
      </Header>
      <Container>
        <Form noValidate onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <Input 
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="8자리 이상의 비밀번호를 입력해주세요."
              ref={inputRef1}
              value={pw}
              onChange={handlePwChange}
              autoComplete="off"
            />
            <EyeIcon onClick={() => setShowPw(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.4 19.5L5.40002 4.5M10.2 10.4416C9.82661 10.8533 9.60002 11.394 9.60002 11.9863C9.60002 13.2761 10.6745 14.3217 12 14.3217C12.6112 14.3217 13.169 14.0994 13.5927 13.7334M20.4388 14.3217C21.265 13.0848 21.6 12.0761 21.6 12.0761C21.6 12.0761 19.4154 5.1 12 5.1C11.5837 5.1 11.1839 5.12199 10.8 5.16349M17.4 17.3494C16.0226 18.2281 14.2494 18.8495 12 18.8127C4.67695 18.693 2.40002 12.0761 2.40002 12.0761C2.40002 12.0761 3.45788 8.69808 6.60002 6.64332" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round"/>
            </EyeIcon>
          </div>
          <div style={{ position: 'relative' }}>
            <Input 
              type={showPwCheck ? "text" : "password"}
              name="passwordCheck"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              ref={inputRef2}
              value={pwCheck}
              onChange={handlePwCheckChange}
              autoComplete="off"
            />
            <EyeIcon onClick={() => setShowPwCheck(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.4 19.5L5.40002 4.5M10.2 10.4416C9.82661 10.8533 9.60002 11.394 9.60002 11.9863C9.60002 13.2761 10.6745 14.3217 12 14.3217C12.6112 14.3217 13.169 14.0994 13.5927 13.7334M20.4388 14.3217C21.265 13.0848 21.6 12.0761 21.6 12.0761C21.6 12.0761 19.4154 5.1 12 5.1C11.5837 5.1 11.1839 5.12199 10.8 5.16349M17.4 17.3494C16.0226 18.2281 14.2494 18.8495 12 18.8127C4.67695 18.693 2.40002 12.0761 2.40002 12.0761C2.40002 12.0761 3.45788 8.69808 6.60002 6.64332" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round"/>
            </EyeIcon>
          </div>
          {!isPwValid && <ErrorMessage>아직 8자리가 아니에요.</ErrorMessage>}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} 
          <SubmitButton isActive={isPwValid && pw === pwCheck} />
        </Form>
      </Container>
    </Whole>
  );
};

export default ChangePassword;
