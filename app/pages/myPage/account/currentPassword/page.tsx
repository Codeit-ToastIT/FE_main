'use client';

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SubmitButton from "../../../../components/common/SubmitButton";
import iconEyeOpen from "../../../../assets/icons/icon_eye_closed.svg";
import iconEyeClosed from "../../../../assets/icons/icon_eye_open.svg";

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
  margin-right: 7%;
  text-align: center;
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

const Link = styled.div`
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

const CurrentPasswordPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pw, setPw] = useState("");
  const isPwNotEmpty = pw.length > 0;
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);

  // 입력 필드 포커싱
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
     e.preventDefault(); // 기본 폼 제출 방지
     try {
        const token = "YOUR_BEARER_TOKEN"; // 실제 Bearer Token으로 교체
        const response = await fetch("/api/auth/password/change", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword: pw }),
        });

      if (response.ok) {
        // API 호출 성공 시, 새 비밀번호 설정 페이지로 이동
        router.push("../changePassword");
      } else {
        // 실패 시 에러 메시지 출력
        const errorMsg = await response.text();
        console.error("비밀번호 변경 API 실패:", errorMsg);
        // 필요하다면 사용자에게 에러 알림 처리
      }
    } catch (error) {
      console.error("비밀번호 변경 API 호출 중 에러 발생:", error);
    }
  };

  const handleLinkClick = () => {
    router.push("/pages/resetPasswordPage");
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
        <Title>기존 비밀번호 입력</Title>
      </Header>
      <Container>
        <Form noValidate>
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
              src={showPw ? iconEyeOpen : iconEyeClosed}
              alt={showPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
              onClick={() => setShowPw((prev) => !prev)}
            />
          </div>
          <SubmitButton isActive={isPwNotEmpty} onClick={handleSubmit} />
        </Form>
        <Link onClick={handleLinkClick}>비밀번호를 잊어버렸나요?</Link>
      </Container>
    </Whole>
  );
};

export default CurrentPasswordPage;
