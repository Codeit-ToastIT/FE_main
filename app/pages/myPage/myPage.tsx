import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useEmail } from '../../context/EmailContext';

interface MyPageProps {
  isPremiumUser: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ isPremiumUser }) => {
  const router = useRouter();
  const { token, userId } = useAuth(); // AuthContext에서 토큰과 userId를 가져옴

  // 사용자 이메일 (초기값은 기본 이메일)
  const { email } = useEmail();
  const [userEmail, setUserEmail] = useState('test@example.com');

  // 수정 모드 활성화 상태
  const [isEditing, setIsEditing] = useState(false);

  // 카테고리 정보를 저장할 상태 (초기값은 빈 문자열)
  const [categories, setCategories] = useState({
    top: '',
    right: '',
    bottom: '',
    left: '',
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // 응답 예시: { email: string, ... }
          setUserEmail(data.email);
        } else {
          console.error('사용자 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('사용자 API 호출 중 에러 발생:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  // userId가 있을 경우, 해당 userId로 카테고리 정보를 불러옴
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
          const data = await response.json();
          // data 형식 예시: { top: string, right: string, bottom: string, left: string }
          const categoryId = data.categories[4]?.id;
          if (categoryId) {
            setCategories(categoryId);
          }
          console.log('API 호출 성공', data);
        } else {
          console.error('카테고리 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('카테고리 API 호출 중 에러 발생:', error);
      }
    };

    fetchCategories();
  }, [token, userId]);

  // 특정 카테고리 이름을 업데이트하는 함수 (PATCH /api/categories/{categoryId})
  const updateCategory = async (categoryId: string, newName: string) => {
    try {
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

  // centerButton 클릭 시 수정 모드 토글
  const handleCenterButtonClick = () => {
    if (isEditing) {
      // 수정 모드 종료: 입력 중인 내용은 반영하지 않고 취소
      setEditingCategory(null);
      setTempCategoryName('');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const userPlan = isPremiumUser ? '메이플 시럽 버터 토스트 플랜 이용중' : '토스트 플랜 이용중';

  return (
    <PageContainer>
      <ContentContainer>
        <Overlay>
          <MyPageContainer onClick={(e) => e.stopPropagation()}>
            <Email>{email}</Email>
            <Plan>{userPlan}</Plan>
            <CircularMenu>
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
                      // 수정 모드일 때만 카테고리 수정 활성화
                      if (isEditing) {
                        setEditingCategory(position);
                        setTempCategoryName(name);
                      }
                    }}
                  >
                    {editingCategory === position ? (
                      <EditingInput
                        value={tempCategoryName}
                        onChange={(e) => setTempCategoryName(e.target.value)}
                        onBlur={async () => {
                          if (editingCategory) {
                            await updateCategory(editingCategory, tempCategoryName);
                            setCategories({
                              ...categories,
                              [editingCategory]: tempCategoryName,
                            });
                          }
                          setEditingCategory(null);
                          setTempCategoryName('');
                        }}
                        autoFocus
                      />
                    ) : (
                      <DisplayText>{name}</DisplayText>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
              <CenterButton onClick={handleCenterButtonClick}>
                <StyledIconEdit
                  src={isEditing ? '/iconbutton_edit.svg' : '/iconbutton.svg'}
                  alt="Edit Button"
                  width={40}
                  height={40}
                />
              </CenterButton>
            </CircularMenu>

            <IconButtons>
              <IconButton onClick={() => router.push('./myPage/account')}>
                <StyledIconProfile
                  src="/icon_profile.svg"
                  alt="계정 아이콘"
                  width={24}
                  height={24}
                />
                <span>계정</span>
              </IconButton>
              <IconButton onClick={() => router.push('./myPage/plan')}>
                <StyledIconPlan src="/icon_card.svg" alt="플랜 아이콘" width={24} height={24} />
                <span>플랜</span>
              </IconButton>
            </IconButtons>
          </MyPageContainer>
        </Overlay>
      </ContentContainer>
    </PageContainer>
  );
};

//
// styled-components (아래 코드는 그대로 사용)
//

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
  right: 85.4%;
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
    transform: translateY(-2px);
  }
`;

const StyledIconEdit = styled(Image)``;
const StyledIconProfile = styled(Image)``;
const StyledIconPlan = styled(Image)``;

export default MyPage;
