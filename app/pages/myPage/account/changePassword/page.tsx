'use client'; 

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SubmitButton from "../../../../components/common/SubmitButton";

import iconEyeOpen from '../../../../assets/icons/icon_eye_open.svg';
import iconEyeClosed from '../../../../assets/icons/icon_eye_closed.svg';
import { API_BASE_URL } from "../../../../api/api";
import { useAuth } from '../../../../context/AuthContext';

const Whole = styled.div<{ fadeOut: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6rem;
  background-color: #171612;
  padding-top: 1.5rem;
  height: 100vh;
  opacity: ${({ fadeOut }) => (fadeOut ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
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
  margin-left: 22%;
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
  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
`;

const BackIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #FF5151;
  font-family: SUIT;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem;
  padding-left: 1rem;
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

const ChangePassword = () => {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState(""); 
  const [pwCheck, setPwCheck] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const isPwNotEmpty = pw.length > 0;
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

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

  const handlePwCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPwCheck = e.target.value;
    setPwCheck(newPwCheck);
    if (newPwCheck.length > 0 && newPwCheck !== pw) {
      setErrorMessage("비밀번호가 서로 달라요.");
    } else {
      setErrorMessage("");
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPassword = localStorage.getItem("currentPassword");
    if (!currentPassword) {
      setErrorMessage("현재 비밀번호 정보가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password/${token}/change`, {
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
      localStorage.removeItem("currentPassword");
      setFadeOut(true);
      setTimeout(() => {
        router.push('./?fadeIn=true');
      }, 50);
    } catch (error) {
      setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleToggleShowPw = () => {
    if (inputRef.current) {
      const caretPos = inputRef.current.selectionStart;
      setShowPw((prev) => !prev);
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

  const handleToggleShowPwCheck = () => {
    if (inputRef2.current) {
      const caretPos = inputRef2.current.selectionStart;
      setShowPwCheck((prev) => !prev);
      setTimeout(() => {
        if (inputRef2.current && caretPos !== null) {
          inputRef2.current.focus();
          inputRef2.current.setSelectionRange(caretPos, caretPos);
        }
      }, 0);
    } else {
      setShowPwCheck((prev) => !prev);
    }
  };

  return (
    <Whole fadeOut={fadeOut}>
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
        <Title>새로운 비밀번호 입력</Title>
      </Header>
      <Container>
        <Form noValidate onSubmit={handleSubmit}>
          <div style={{ position: "relative" }}>
            <Input 
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="비밀번호를 입력해주세요."
              ref={inputRef}
              value={pw}
              onChange={handlePwChange}
              autoComplete="off"
            />
            <IconEye
              src={showPw ? iconEyeOpen.src : iconEyeClosed.src}
              alt={showPw ? "비밀번호 보이기" : "비밀번호 숨기기"}
              width={24}
              height={24}
              onClick={handleToggleShowPw}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Input 
              type={showPwCheck ? "text" : "password"}
              name="passwordCheck"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              ref={inputRef2}
              value={pwCheck}
              onChange={handlePwCheckChange}
              autoComplete="off"
            />
            <IconEye
              src={showPwCheck ? iconEyeOpen.src : iconEyeClosed.src}
              alt={showPwCheck ? "비밀번호 보이기" : "비밀번호 숨기기"}
              width={24}
              height={24}
              onClick={handleToggleShowPwCheck}
            />
          </div>
          {!isPwNotEmpty && <ErrorMessage>아직 8자리가 아니에요.</ErrorMessage>}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} 
          <SubmitButton isActive={isPwNotEmpty && pw === pwCheck} />
        </Form>
      </Container>
    </Whole>
  );
};

export default ChangePassword;
