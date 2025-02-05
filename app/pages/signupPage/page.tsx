"use client";

import axios from "axios"; 
import { styled } from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEmail } from "../../context/EmailContext";
import { useAuth } from '../../context/AuthContext';
import SubmitButton from '../../components/common/SubmitButton';


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
  right: 1rem; /* 오른쪽 여백 */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const SignupPage = () => {

  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const { email } = useEmail();  
  const { login } = useAuth();
  const [pw, setPw] = useState(""); 
  const [pwCheck, setPwCheck] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

  // BackIcon 클릭 시 이전 화면으로 이동
  const handleBackClick = () => {
    router.back(); // 이전 페이지로 이동
  };
  
  // 회원가입 요청 
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 방지

    if (pw !== pwCheck) {
      setErrorMessage("비밀번호가 서로 달라요.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        email, 
        password: pw,
        confirmPassword: pwCheck,
      });

      // 회원가입 성공 시 토큰 저장 및 로그인 상태 업데이트
      if (response.data.token) {
        login(response.data.token); // AuthContext의 login 함수 호출
        setSuccessMessage(response.data.message);
        console.log(successMessage);
        router.push("/pages/createToastPage"); // 홈 페이지로 이동
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("회원가입에 실패했습니다.");
        }
      } else {
        setErrorMessage("회원가입에 실패했습니다.");
      }
    }
  };
  
  return (
    <Whole onMouseDown={handleMouseDown}>
      <Header>
        <BackIcon onClick={handleBackClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M14.4 16.7998L9.59998 11.9998L14.4 7.19981" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </BackIcon>
        <Title>회원가입</Title>
      </Header>
      <Container>
        <Form noValidate onSubmit={handleSignup}>
          <div style={{ position: 'relative' }}>
            <Input 
              type={showPw ? "text" : "password"} // 비밀번호 타입 전환
              name="password"
              placeholder="8자리 이상의 비밀번호를 입력해주세요."
              ref={inputRef1}
              value={pw}
              onChange={handlePwChange} // 비밀번호 상태 업데이트
              autoComplete="off"
            />
            <EyeIcon onClick={() => setShowPw(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.4 19.5L5.40002 4.5M10.2 10.4416C9.82661 10.8533 9.60002 11.394 9.60002 11.9863C9.60002 13.2761 10.6745 14.3217 12 14.3217C12.6112 14.3217 13.169 14.0994 13.5927 13.7334M20.4388 14.3217C21.265 13.0848 21.6 12.0761 21.6 12.0761C21.6 12.0761 19.4154 5.1 12 5.1C11.5837 5.1 11.1839 5.12199 10.8 5.16349M17.4 17.3494C16.0226 18.2281 14.2494 18.8495 12 18.8127C4.67695 18.693 2.40002 12.0761 2.40002 12.0761C2.40002 12.0761 3.45788 8.69808 6.60002 6.64332" stroke="#E5DCCA" strokeWidth="2" strokeLinecap="round"/>
            </EyeIcon>
          </div>
          <div style={{ position: 'relative' }}>
            <Input 
              type={showPwCheck ? "text" : "password"} // 비밀번호 확인 타입 전환
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
          {!isPwValid && <ErrorMessage>아직 8자리가 아니에요.</ErrorMessage>} {/* 오류 메시지 조건부 렌더링 */}
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} {/* 오류 메시지 표시 */}
          <SubmitButton 
          isActive={isPwValid && pw === pwCheck} 
          />
        </Form>
      </Container>
    </Whole>
  );
};

export default SignupPage;
