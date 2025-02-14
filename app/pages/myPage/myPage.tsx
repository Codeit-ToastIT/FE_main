'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useEmail } from '../../context/EmailContext';
import radial_default from '../../assets/save/4-radial_menu.svg';
import radial_edit from '../../assets/save/4-radial_menu_edit.svg';
import check from '../../assets/icons/icon_check.svg';
import edit from '../../assets/icons/icon_edit.svg';
import account from '../../assets/icons/icon_profile_b.svg';
import plan from '../../assets/icons/icon_card_b.svg';

interface CategoryData {
  id: string;
  name: string;
}

interface MyPageProps extends React.HTMLAttributes<HTMLDivElement> {
  $isOpen: boolean;
  isPremiumUser?: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ $isOpen, isPremiumUser }) => {
  const router = useRouter();
  const { token, userId } = useAuth();
  const { email } = useEmail();

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || email || 'test@example.com';
  });

  useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email);
      setUserEmail(email);
    }
  }, [email]);

  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState('');

  const positions = ['top', 'right', 'bottom', 'left'];

  // 텍스트 입력창의 높이를 조절하기 위한 상태
  const [inputHeight, setInputHeight] = useState('1.1rem');

  // 숨은 span을 이용하여 텍스트 너비를 측정할 ref
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // GET 요청: 서버에서 카테고리 데이터(id, name 포함)를 받아옴
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.categories && Array.isArray(data.categories)) {
            setCategories(data.categories.slice(0, 4));
          }
          console.log('카테고리 데이터 불러오기 성공:', data);
        } else {
          console.error('카테고리 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('카테고리 GET API 호출 중 에러 발생:', error);
      }
    };

    if (userId && token) {
      fetchCategories();
    }
  }, [userId, token]);

  // tempCategoryName이 바뀔 때마다 숨은 span의 너비를 측정하고, 한 줄 너비(예: 80px)와 비교하여 높이를 결정
  useEffect(() => {
    if (hiddenSpanRef.current) {
      hiddenSpanRef.current.textContent = tempCategoryName || ' ';
      const textWidth = hiddenSpanRef.current.offsetWidth;
      const oneLineWidth = 80;
      setInputHeight(textWidth > oneLineWidth ? '2rem' : '1.1rem');
    }
  }, [tempCategoryName]);

  const updateCategory = async (index: number, newName: string) => {
    try {
      const categoryId = categories[index].id;
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        console.error('카테고리 업데이트 실패:', errorMsg);
      }
    } catch (error) {
      console.error('카테고리 업데이트 API 호출 중 에러 발생:', error);
    }
  };

  const handleCenterButtonClick = () => {
    if (isEditing) {
      setEditingIndex(null);
      setTempCategoryName('');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const userPlan = isPremiumUser ? '메이플 시럽 버터 토스트 플랜 이용중' : '토스트 플랜 이용중';

  return (
    <div>
      <PageContainer>
        <ContentContainer>
          <Overlay>
            <MyPageContainer $isOpen={$isOpen} onClick={(e) => e.stopPropagation()}>
              <Email>{userEmail}</Email>
              <Plan>{userPlan}</Plan>
              <CircularMenu>
                <MenuImage
                  src={isEditing ? radial_edit.src : radial_default.src}
                  alt="Circular Menu"
                />
                <MenuItems>
                  {categories.map((cat, index) => {
                    const position = positions[index];
                    return (
                      <MenuItem
                        key={cat.id}
                        $position={position}
                        onClick={() => {
                          if (isEditing) {
                            setEditingIndex(index);
                            setTempCategoryName(cat.name);
                          }
                        }}
                      >
                        {editingIndex === index ? (
                          <EditingInput
                            value={tempCategoryName}
                            onChange={(e) => setTempCategoryName(e.target.value)}
                            onFocus={(e) => {
                              const length = e.currentTarget.value.length;
                              e.currentTarget.setSelectionRange(length, length);
                            }}
                            onBlur={async () => {
                              if (editingIndex !== null) {
                                await updateCategory(editingIndex, tempCategoryName);
                                const newCategories = [...categories];
                                newCategories[editingIndex] = {
                                  ...newCategories[editingIndex],
                                  name: tempCategoryName,
                                };
                                setCategories(newCategories);
                                setEditingIndex(null);
                                setTempCategoryName('');
                              }
                            }}
                            autoFocus
                            style={{ height: inputHeight }}
                          />
                        ) : (
                          <DisplayText>{cat.name}</DisplayText>
                        )}
                      </MenuItem>
                    );
                  })}
                </MenuItems>
                <CenterButton onClick={handleCenterButtonClick} $isEditing={isEditing}>
                  <StyledIconEdit
                    src={isEditing ? check.src : edit.src}
                    alt="Edit Button"
                    width={24}
                    height={24}
                  />
                </CenterButton>
              </CircularMenu>
              <IconButtons>
                <IconButton onClick={() => router.push('./myPage/account')}>
                  <StyledIconProfile src={account.src} alt="계정 아이콘" width={24} height={24} />
                  <span>계정</span>
                </IconButton>
                <IconButton onClick={() => router.push('./myPage/plan')}>
                  <StyledIconPlan src={plan.src} alt="플랜 아이콘" width={24} height={24} />
                  <span>플랜</span>
                </IconButton>
              </IconButtons>
            </MyPageContainer>
          </Overlay>
        </ContentContainer>
        {/* 텍스트 너비 측정을 위한 숨은 span */}
        <HiddenSpan ref={hiddenSpanRef} />
      </PageContainer>
    </div>
  );
};

const PageContainer = styled.div`
  position: relative;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
`;

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

// $isOpen prop에 따라 슬라이드 효과를 주도록 transform 값을 동적으로 변경합니다.

const MyPageContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  width: 320px;
  height: 100dvh;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1100;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    /* glass */
    backdrop-filter: blur(4px);
    z-index: -1;
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
  }

  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(100%)' : 'translateX(10%)')};
  transition: transform 1s ease-in-out;
  isolation: isolate;
`;

const Email = styled.div`
  margin-top: 140px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
`;

const Plan = styled.div`
  margin: 5px 0 30px 0;
  font-size: 12px;
  font-weight: 800;
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

const MenuItem = styled.div<{ $position: string }>`
  position: absolute;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  ${({ $position }) => $position === 'top' && 'top: 20px; left: 50%; transform: translateX(-50%);'}
  ${({ $position }) =>
    $position === 'right' && 'right: 10px; top: 50%; transform: translateY(-50%);'}
  ${({ $position }) =>
    $position === 'bottom' && 'bottom: 20px; left: 50%; transform: translateX(-50%);'}
  ${({ $position }) => $position === 'left' && 'left: 10px; top: 50%; transform: translateY(-50%);'}
`;

const DisplayText = styled.span`
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

const EditingInput = styled.textarea`
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
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  white-space: pre-wrap;
  word-break: break-all;
  height: 2rem;
  max-height: 2rem;
`;

const CenterButton = styled.button<{ $isEditing: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $isEditing }) => ($isEditing ? '#161712' : '#888')};
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
    transform: translateY(-1px);
  }
`;

const StyledIconEdit = styled(Image)``;
const StyledIconProfile = styled(Image)``;
const StyledIconPlan = styled(Image)``;

const HiddenSpan = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  font-size: 14px;
  padding: 0;
  margin: 0;
`;

export default MyPage;
