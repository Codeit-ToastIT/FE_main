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

const Link = styled.div`
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
`

const BackIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
`;



const LoginPage = () => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState(""); 
  const isPwNotEmpty = pw.length > 0; 
  
    // 입력 필드 포커싱 
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus(); // 입력 필드에 포커스
        }
      }, 100);
  
      return () => clearTimeout(timeoutId);
    }, []);
  
    const handleMouseDown = (event: React.MouseEvent) => {
      event.preventDefault(); // 기본 동작 방지
      inputRef.current?.focus(); // 입력 필드에 포커스
    };

      // 비밀번호 입력 시 상태 업데이트
      const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value); 
      };


  return (
    <Whole onMouseDown={handleMouseDown}>
      <Header>
        <BackIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M14.4 16.7998L9.59998 11.9998L14.4 7.19981" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </BackIcon>
        <Title>로그인</Title>
      </Header>
      <Container>
        <Form noValidate>
        <Input 
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요."
          ref={inputRef}
          value={pw}
          onChange={handlePwChange} // 비밀번호 상태 업데이트
          // onInvalid={() => setError("비밀번호를 확인해주세요.")}
          autoComplete="off"
        />
        {/* {error && <ErrorMessage>{error}</ErrorMessage>}  */}
        <Submit type="submit" value="계속하기"  isActive={isPwNotEmpty} disabled={!isPwNotEmpty}/>
        </Form>
        <Link>비밀번호를 잊어버렸나요?</Link>
      </Container>
    </Whole>
  )
}
export default LoginPage;