/**
 * 파일명: page.tsx
 * 작성일: 2025-02-02
 * 작성자: 이유진
 * 설명: 마이페이지 화면 수정 및 styled-components 반영.
 */

"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/layout/header';
import { useRouter } from "next/navigation"; // Next.js 라우터 추가

interface MyPageProps {
  userEmail: string;
  isPremiumUser: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ userEmail, isPremiumUser }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState({
    top: "카테고리 1",
    right: "카테고리 2",
    bottom: "카테고리 3",
    left: "카테고리 4",
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState("");

  const displayedEmail = userEmail || "test@example.com";
  const userPlan = isPremiumUser ? "유료 플랜 이용중" : "무료 플랜 이용중";

  return (
    <PageContainer>
      <Header 
        title="TOAST IT"
        onHelpClick={() => console.log("Help clicked")}
        onProfileClick={() => setIsOpen(true)} 
      />

      <ContentContainer>
        {isOpen && (
          <Overlay onClick={() => setIsOpen(false)}>
            <MyPageContainer onClick={(e) => e.stopPropagation()}>
              <Email>{displayedEmail}</Email>
              <Plan>{userPlan}</Plan>
              <CircularMenu>
                <MenuImage src="/4-radial_menu.png" alt="Circular Menu" />
                <MenuItems>
                  {Object.entries(categories).map(([position, name]) => (
                    <MenuItem
                      key={position}
                      position={position}
                      onClick={() => {
                        setEditingCategory(position);
                        setTempCategoryName(categories[position as keyof typeof categories]);
                      }}
                    >
                      {editingCategory === position ? (
                        <CategoryText>
                          <InlineInput
                            type="text"
                            value={tempCategoryName}
                            onChange={(e) => setTempCategoryName(e.target.value)}
                            onBlur={() => {
                              setCategories({
                                ...categories,
                                [editingCategory!]: tempCategoryName,
                              });
                              setEditingCategory(null);
                              setTempCategoryName("");
                            }}
                            autoFocus
                          />
                        </CategoryText>
                      ) : (
                        <CategoryText>{name}</CategoryText>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
                <CenterButton>
                  <img src="/iconbutton.png" alt="Edit Button" />
                </CenterButton>
              </CircularMenu>

              <IconButtons>
                <IconButton onClick={() => router.push("./myPage/account")}>
                  <img src="/icon_profile.png" alt="계정 아이콘" />
                  <span>계정</span>
                </IconButton>
                <IconButton onClick={() => router.push("./myPage/plan")}>
                  <img src="/icon_card.png" alt="플랜 아이콘" />
                  <span>플랜</span>
                </IconButton>
              </IconButtons>
            </MyPageContainer>
          </Overlay>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PageContainer = styled.div`
  position: relative;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  display: flex;
`;

const MyPageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1100;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.85);
    z-index: -1;
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
  }

  &.open {
    transform: translateX(0);
  }
  &.closed {
    transform: translateX(100%);
  }
`;

const Email = styled.div`
  margin-top: 96px;
  font-family: 'SUIT-Variable';
  font-size: 12px;
  text-align: center;
`;

const Plan = styled.div`
  margin-bottom: 20px;
  font-family: 'SUIT-Variable';
  font-size: 12px;
  font-weight: 600;
  text-align: center;
`;

const CircularMenu = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const MenuImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const MenuItems = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuItem = styled.div<{ position: string }>`
  position: absolute;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  /* 각 위치별로 고정된 기준점에 배치 */
  ${({ position }) =>
    position === "top" && "top: 20px; left: 50%; transform: translateX(-50%);"}
  ${({ position }) =>
    position === "right" && "right: 10px; top: 50%; transform: translateY(-50%);"}
  ${({ position }) =>
    position === "bottom" && "bottom: 20px; left: 50%; transform: translateX(-50%);"}
  ${({ position }) =>
    position === "left" && "left: 10px; top: 50%; transform: translateY(-50%);"}
`;

/* 카테고리 텍스트의 고정 폭 래퍼 */
const CategoryText = styled.span`
  display: inline-block;
  width: 80px; /* 원하는 고정폭으로 설정 */
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const InlineInput = styled.input`
  color: #fff;
  font-size: 14px;
  border: none;
  background: transparent;
  text-align: center;
  outline: none;
  width: 100%;
  padding: 0;
  margin: 0;
  /* 텍스트가 길어져도 잘리도록 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  caret-color: auto;
`;

const CenterButton = styled.button`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const IconButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  gap: 20px;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export default MyPage;
