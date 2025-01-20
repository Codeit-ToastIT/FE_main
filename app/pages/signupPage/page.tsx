"use client";

import { styled } from "styled-components";
import React, { useEffect, useRef, useState } from "react";

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
`

const Submit = styled.input.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop)
})<{ isActive: boolean }>`
  display: flex;
  height: 2.5rem;
  border-radius: 2.5rem;
  border: 1px solid var(--ivory, #E5DCCA);
  background-color: ${({ isActive }) => (isActive ? '#E5DCCA' : 'transparent')};
  color: ${({ isActive }) => (isActive ? '#171612' : '#E5DCCA')};
  opacity: ${({ isActive }) => (isActive ? '1' : '0.2')};
  font-weight: 800;
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

const SignupPage = () => {

  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState(""); 
  const [pwCheck, setPwCheck] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const isPwNotEmpty = pw.length > 0; 
  const isPwValid = pw.length >= 8; // 비밀번호 유효성 체크

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
        setErrorMessage("영소문자와 숫자 조합을 입력해주세요."); // 오류 메시지 설정
      } else {
        setErrorMessage(""); // 오류 메시지 초기화
      }
    } else {
      setErrorMessage(""); // 비밀번호가 8자리가 안 될 경우 오류 메시지 초기화
    }
  };

  // 비밀번호 확인 입력 시 상태 업데이트
  const handlePwCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPwCheck = e.target.value;
    setPwCheck(newPwCheck);

    // 비밀번호 확인 입력이 시작될 때부터 확인
    if (newPwCheck.length > 0) {
      if (newPwCheck !== pw) {
        setErrorMessage("비밀번호가 서로 달라요."); // 비밀번호 불일치 오류 메시지 설정
      } else {
        setErrorMessage(""); // 비밀번호가 같을 때 오류 메시지 초기화
      }
    }
  };

  

  return (
    <Whole onMouseDown={handleMouseDown}>
      <Header>
        <BackIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M14.4 16.7998L9.59998 11.9998L14.4 7.19981" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </BackIcon>
        <Title>회원가입</Title>
      </Header>
      <Container>
        <Form noValidate>
        <Input 
          type="password"
          name="password"
          placeholder="8자리 이상의 비밀번호를 입력해주세요."
          ref={inputRef1}
          value={pw}
          onChange={handlePwChange} // 비밀번호 상태 업데이트
          autoComplete="off"
        />
        <Input 
          type="password"
          name="password"
          placeholder="비밀번호를 한 번 더 입력해주세요."
          ref={inputRef2}
          value={pwCheck}
          onChange={handlePwCheckChange} // 비밀번호 상태 업데이트
          autoComplete="off"
        />
        {!isPwValid && <ErrorMessage>아직 8자리가 아니에요.</ErrorMessage>} {/* 오류 메시지 조건부 렌더링 */}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} {/* 오류 메시지 표시 */}
        <Submit type="submit" value="계속하기"  isActive={isPwValid && pw === pwCheck} disabled={!isPwValid || pw !== pwCheck}/>
        </Form>
      </Container>
    </Whole>
  );
};

export default SignupPage;