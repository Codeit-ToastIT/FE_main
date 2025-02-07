/**
 * 파일명: page.tsx
 * 작성일: 2025-02-02
 * 작성자: 이유진
 * 설명: 마이페이지 화면 수정 및 styled-components 반영.
 */

'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

import Header from '../../components/layout/header';
import Body from '../../components/common/body';
import { useRouter } from 'next/navigation';

interface MyPageProps {
  userEmail: string;
  isPremiumUser: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ userEmail, isPremiumUser }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  // 수정 모드 활성화를 위한 상태
  const [isEditing, setIsEditing] = useState(false);

  const [categories, setCategories] = useState({
    top: '카테고리 1',
    right: '카테고리 2',
    bottom: '카테고리 3',
    left: '카테고리 4',
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState('');

  const displayedEmail = userEmail || 'test@example.com';
  const userPlan = isPremiumUser ? '메이플 시럽 버터 토스트 플랜 이용중' : '토스트 플랜 이용중';

  // centerButton 클릭 시 수정 모드 토글
  const handleCenterButtonClick = () => {
    if (isEditing) {
      // 수정모드 종료 시 입력 중인 내용은 반영하지 않고 취소
      setEditingCategory(null);
      setTempCategoryName('');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <PageContainer>
      <Header
        title="TOAST IT"
        onHelpClick={() => console.log('Help clicked')}
        onProfileClick={() => setIsOpen(true)}
      />

      <ContentContainer>
        {isOpen && (
          <Overlay onClick={() => setIsOpen(false)}>
            <MyPageContainer onClick={(e) => e.stopPropagation()}>
              <Email>{displayedEmail}</Email>
              <Plan>{userPlan}</Plan>
              <CircularMenu>
                {/* 수정모드 여부에 따라 배경 이미지 변경 (이미지 주소는 원하시는 것으로 변경) */}
                <MenuImage
                  src={isEditing ? '/4-radial_menu_edit.svg' : '/4-radial_menu.svg'}
                  alt="Circular Menu"
                />
                <MenuItems>
                  {Object.entries(categories).map(([position, name]) => (
                    <MenuItem
                      key={position}
                      position={position}
                      onClick={() => {
                        // 수정 모드일 때만 해당 카테고리 수정 활성화
                        if (isEditing) {
                          setEditingCategory(position);
                          setTempCategoryName(categories[position as keyof typeof categories]);
                        }
                      }}
                    >
                      {editingCategory === position ? (
                        // 편집 시: 제한 없이 입력 가능 (줄 제한 없음)
                        <EditingInput
                          value={tempCategoryName}
                          onChange={(e) => setTempCategoryName(e.target.value)}
                          onBlur={() => {
                            // 포커스가 벗어나면 저장
                            setCategories({
                              ...categories,
                              [editingCategory!]: tempCategoryName,
                            });
                            setEditingCategory(null);
                            setTempCategoryName('');
                          }}
                          autoFocus
                        />
                      ) : (
                        // 저장된 상태: 최대 2줄까지만 표시되고, 2줄 넘으면 말줄임표 처리
                        <DisplayText>{name}</DisplayText>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
                <CenterButton onClick={handleCenterButtonClick}>
                  {/* centerButton 이미지도 수정 모드에 따라 변경 */}
                  <img
                    src={isEditing ? '/iconbutton_edit.svg' : '/iconbutton.svg'}
                    alt="Edit Button"
                  />
                </CenterButton>
              </CircularMenu>

              <IconButtons>
                <IconButton onClick={() => router.push('./myPage/account')}>
                  <img src="/icon_profile.svg" alt="계정 아이콘" />
                  <span>계정</span>
                </IconButton>
                <IconButton onClick={() => router.push('./myPage/plan')}>
                  <img src="/icon_card.svg" alt="플랜 아이콘" />
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
  position: absolute;
  top: 0;
  right: 85%;
  width: 320px;
  height: 100vh;
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
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: -1;
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
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
  margin-bottom: 16px;
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

  ${({ position }) => position === 'top' && 'top: 20px; left: 50%; transform: translateX(-50%);'}
  ${({ position }) => position === 'right' && 'right: 10px; top: 50%; transform: translateY(-50%);'}
  ${({ position }) =>
    position === 'bottom' && 'bottom: 20px; left: 50%; transform: translateX(-50%);'}
  ${({ position }) => position === 'left' && 'left: 10px; top: 50%; transform: translateY(-50%);'}
`;

/* 저장된(비편집) 상태에서 보여줄 텍스트 (최대 2줄까지 표시, 초과시 말줄임표 처리) */
const DisplayText = styled.span`
  font-family: 'SUIT-Regular';
  width: 80px;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
  max-height: 2.4em;
`;

/* 편집 시 사용하는 입력창: 길이 제한 없이 입력할 수 있음 */
const EditingInput = styled.textarea`
  font-family: 'SUIT-Regular';
  color: #edca85;
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: transparent;
  text-align: center;
  outline: none;
  width: 80px;
  padding: 0;
  margin: 0;
  resize: none;
  overflow: auto;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  white-space: pre-wrap;
  word-break: break-all;
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
  padding: 8px 0;
`;

const IconButton = styled.div`
  display: flex;
  font-family: 'SUIT-Regular';
  font-weight: 600;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
  cursor: pointer;
  border-radius: 40px;

  &:hover {
    background-color: white;
  }

  & > img,
  & > span {
    vertical-align: middle;
  }

  & > span {
    transform: translateY(-2px); /* 필요에 따라 값 조절 */
  }
`;

export default MyPage;
