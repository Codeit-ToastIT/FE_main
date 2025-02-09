'use client';

import React, { useEffect, useState } from 'react';
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

// API 응답 데이터 타입 정의
interface CategoryApiResponse {
  categories: { id: string }[];
}

interface MyPageProps extends React.HTMLAttributes<HTMLDivElement> {
  $isOpen: boolean;
  isPremiumUser?: boolean;
}

/* 로컬 스토리지에서 카테고리 이름 매핑을 불러옴 */
const getStoredCategoryNames = (): { [key: string]: string } => {
  const stored = localStorage.getItem('categoryNames');
  return stored ? JSON.parse(stored) : {};
};

/* 로컬 스토리지에 특정 카테고리 이름 업데이트 */
const storeCategoryName = (id: string, name: string) => {
  const mapping = getStoredCategoryNames();
  mapping[id] = name;
  localStorage.setItem('categoryNames', JSON.stringify(mapping));
};

const MyPage: React.FC<MyPageProps> = ({ $isOpen, isPremiumUser }) => {
  const router = useRouter();
  const { token, userId } = useAuth();
  const { email } = useEmail();

  // 이메일은 EmailContext 또는 localStorage에서 불러옴
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || email || 'test@example.com';
  });

  useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email);
      setUserEmail(email);
    }
  }, [email]);

  // 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);

  // 카테고리 데이터를 객체 배열로 관리
  // 기본값은 API GET 이후 덮어씁니다.
  const [categories, setCategories] = useState<CategoryData[]>([
    { id: 'dummy1', name: '카테고리 1' },
    { id: 'dummy2', name: '카테고리 2' },
    { id: 'dummy3', name: '카테고리 3' },
    { id: 'dummy4', name: '카테고리 4' },
  ]);

  // 수정 중인 카테고리의 인덱스 및 임시 값
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState('');

  // 각 인덱스에 해당하는 위치 (스타일 적용용)
  const positions = ['top', 'right', 'bottom', 'left'];

  // GET 요청: 서버로부터 카테고리 데이터(id만 있음)를 불러오고, 로컬 스토리지에 저장된 이름을 적용
  useEffect(() => {
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
          const data: CategoryApiResponse = await response.json();
          if (data.categories && Array.isArray(data.categories)) {
            // 기본 이름 배열
            const defaultNames = ['카테고리 1', '카테고리 2', '카테고리 3', '카테고리 4'];
            const storedMapping = getStoredCategoryNames();
            // 상위 4개의 카테고리만 사용 (필요에 따라 조정)
            const fetchedCategories: CategoryData[] = data.categories
              .slice(0, 4)
              .map((cat, index) => ({
                id: cat.id,
                // 로컬에 저장된 이름이 있으면 사용, 없으면 기본 이름 사용
                name: storedMapping[cat.id] || defaultNames[index],
              }));
            setCategories(fetchedCategories);
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

  // PATCH 요청: 수정된 카테고리 이름을 업데이트하고 로컬 스토리지에도 저장
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
      } else {
        // 성공 시 로컬 스토리지 업데이트
        storeCategoryName(categoryId, newName);
      }
    } catch (error) {
      console.error('카테고리 업데이트 API 호출 중 에러 발생:', error);
    }
  };

  // centerButton 클릭 시 수정 모드 토글
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
            <MyPageContainer onClick={(e) => e.stopPropagation()}>
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
                        position={position}
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
                          />
                        ) : (
                          <DisplayText>{cat.name}</DisplayText>
                        )}
                      </MenuItem>
                    );
                  })}
                </MenuItems>
                <CenterButton onClick={handleCenterButtonClick} isEditing={isEditing}>
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
      </PageContainer>
    </div>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 900px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PageContainer = styled.div`
  position: relative;
  margin: 0 auto;
  height: 1500px;
`;

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 1500px;
  top: 0;
  left: 0;
  display: flex;
`;

const MyPageContainer = styled.div`
  position: absolute;
  top: 0;
  right: 85.4%;
  width: 320px;
  height: 815px;
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
    background-color: rgba(255, 255, 255, 0.6);
    /* glass */
    backdrop-filter: blur(4px);
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
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  white-space: pre-wrap;
  word-break: break-all;
`;

/* CenterButton: 배경색을 isEditing prop에 따라 다르게 지정 */
const CenterButton = styled.button<{ isEditing: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ isEditing }) => (isEditing ? '#161712' : '#666')};
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
    transform: translateY(-2px);
  }
`;

const StyledIconEdit = styled(Image)``;
const StyledIconProfile = styled(Image)``;
const StyledIconPlan = styled(Image)``;

export default MyPage;
