/**
 * 파일명: page.tsx
 * 작성일: 2025-02-01
 * 작성자: 이유진
 * 설명: 계정 페이지 구현.
 */

"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

// 계정 메뉴
const AccountPage = () => {
    const [showTermsOverlay, setShowTermsOverlay] = useState(false);
    const [activeTab, setActiveTab] = useState("terms");
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>←</BackButton>
        <TitleWrapper>
          <TitleContainer>
            <Title>계정</Title>
          </TitleContainer>
        </TitleWrapper>
      </Header>

      <MenuContainer>
        <MenuItem>
          <Icon>🔒</Icon>
          비밀번호 변경
        </MenuItem>
        <MenuItem onClick={() => setShowTermsOverlay(true)}>
          <Icon>📄</Icon>
          이용 약관
        </MenuItem>
        <MenuItem onClick={() => setShowLogoutModal(true)}>
          <Icon>📂</Icon>
          로그아웃
        </MenuItem>
        <MenuItem className="danger" onClick={() => setShowDeleteModal(true)}>
          <Icon>🔴</Icon>
          회원 탈퇴
        </MenuItem>
      </MenuContainer>

      {showTermsOverlay && (
        <TermsContainer show={showTermsOverlay}>
          <TermsHeader>
            <BackButton onClick={() => setShowTermsOverlay(false)}>←</BackButton>
          <ScrollableTabs>
            <Tab active={(activeTab === "terms" ? "true" : "false").toString()} onClick={() => setActiveTab("terms")}>
              이용약관
            </Tab>
            <Tab active={(activeTab === "privacy" ? "true" : "false").toString()} onClick={() => setActiveTab("privacy")}>
              개인정보처리방침
            </Tab>
            <Tab active={(activeTab === "refund" ? "true" : "false").toString()} onClick={() => setActiveTab("refund")}>
              결제 및 환불 정책
            </Tab>
          </ScrollableTabs>
          </TermsHeader>
          <Content>
            {activeTab === "terms" && <p>이 약관은 토스트잇의 이용 조건 및 절차, 회원과 서비스 제공자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>}
            {activeTab === "privacy" && <p>개인정보처리방침에 대한 상세한 내용이 들어갈 자리입니다.</p>}
            {activeTab === "refund" && <p>결제 및 환불 정책에 대한 상세한 내용이 들어갈 자리입니다.</p>}
          </Content>
        </TermsContainer>
      )}

      {showLogoutModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>로그아웃 할까요?</ModalTitle>
            <ModalDescription>로그아웃해도 메모는 남아있어요.</ModalDescription>
            <ModalActions>
              <CancelButton onClick={() => setShowLogoutModal(false)}>취소</CancelButton>
              <LogoutButton onClick={() => console.log("로그아웃")}>로그아웃</LogoutButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>토스트잇에서 탈퇴할까요?</ModalTitle>
            <ModalDescription>탈퇴 시 모든 메모가 사라져요.</ModalDescription>
            <ModalActions>
              <CancelButton onClick={() => setShowDeleteModal(false)}>취소</CancelButton>
              <DeleteButton onClick={() => console.log("회원 탈퇴")}>탈퇴</DeleteButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      <Footer>앱 버전 1.0.0</Footer>
    </Container>
  );
};


export default AccountPage;


const TermsContainer = styled.div`
  width: 375px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: ${({ show }) => (show ? "0" : "100%")};
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: top 0.3s ease-in-out;
`;

const TermsHeader = styled.div`
  width: 375px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9.5px;
`;

const ScrollableTabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  background: #000;
  border-radius: 40px;
  overflow: hidden;
`;

const Tab = styled.button`
  flex: none;
  background: ${({ active }) => (active === "true" ? "#806952" : "transparent")};
  color: ${({ active }) => (active === "true" ? "#fff" : "#000")};
  border: none;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 40px;
  cursor: pointer;
`;

const Content = styled.div`
  text-align: left;
  font-size: 14px;
  color: #f5e8d6;
  padding: 10px;
  margin: 0 20px;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f5e8d6;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: transparent;
  padding: 10px;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 원형 버튼 */
  background-color: #000;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const TitleContainer = styled.div`
  flex: 1;
  background-color: #000;
  border-radius: 24px; /* 둥근 사각형 */
  padding: 8.67px 20px;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 18px;
  color: #f5e8d6;
  font-weight: bold;
  margin: 0;
`;

const MenuContainer = styled.div`
  width: 90%;
  margin-top: 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 12px 0;
  cursor: pointer;
  font-weight: bold;
  &.danger {
    color: red;
  }
`;

const Icon = styled.span`
  font-size: 20px;
  margin-right: 10px;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  font-size: 12px;
  color: #000;
  text-align: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  width: 275px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  padding: 20px;
  text-align: center;
  margin-right: 15px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ModalDescription = styled.p`
  font-size: 14px;
  color: #666;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #a66a2c;
  font-weight: bold;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #a66a2c;
  font-weight: bold;
  cursor: pointer;
`;
