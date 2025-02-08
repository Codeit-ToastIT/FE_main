import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface MyPageProps {
  // isPremiumUser는 여기서 props로 받을 수도 있고, 로그인 API에서 받아올 수도 있습니다.
  isPremiumUser: boolean;
}

const MyPage: React.FC<MyPageProps> = ({ isPremiumUser }) => {
  const router = useRouter();

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

  // 로그인 API로부터 받아온 사용자 정보 상태
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // 화면에 표시할 이메일 (userEmail이 없으면 기본 이메일 사용)
  const displayedEmail = userEmail || 'test@example.com';
  const userPlan = isPremiumUser ? '메이플 시럽 버터 토스트 플랜 이용중' : '토스트 플랜 이용중';

  // 1. 로그인 API를 호출하여 사용자 정보 (이메일, id 등)를 가져옴
  useEffect(() => {
    const fetchLogin = async () => {
      try {
        // 예시: localStorage에 저장된 이메일 사용 (실제 환경에 맞게 수정)
        const storedEmail = localStorage.getItem('loginEmail') || 'test@example.com';
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: storedEmail }),
        });
        if (response.ok) {
          const data = await response.json();
          // 예시 응답: { id: string, email: string, isPremium: boolean }
          setUserEmail(data.email);
          setUserId(data.id);
          // 만약 isPremiumUser 정보도 API로부터 받아올 수 있다면 여기에 반영 가능
        } else {
          console.error('로그인 API 호출 실패:', response.statusText);
        }
      } catch (error) {
        console.error('로그인 API 호출 중 에러 발생:', error);
      }
    };

    fetchLogin();
  }, []);

  // 2. userId가 설정된 후, API를 통해 카테고리 정보를 불러옴
  useEffect(() => {
    if (!userId) return; // userId가 아직 없으면 API 호출하지 않음
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories/{userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 필요 시 Authorization 헤더 추가
          },
        });
        if (response.ok) {
          const data = await response.json();
          // data 형식 예시: { top: string, right: string, bottom: string, left: string }
          setCategories(data);
        } else {
          console.error('카테고리 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('카테고리 API 호출 중 에러 발생:', error);
      }
    };

    fetchCategories();
  }, [userId]);

  // 3. 특정 카테고리 이름을 업데이트하는 함수 (PATCH /api/categories/{categoryId})
  const updateCategory = async (categoryId: string, newName: string) => {
    try {
      const response = await fetch(`/api/categories/{categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 필요 시 Authorization 헤더 추가
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

  return (
    <PageContainer>
      <ContentContainer>
        <Overlay>
          <MyPageContainer onClick={(e) => e.stopPropagation()}>
            <Email>{displayedEmail}</Email>
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
// styled-components (기존 코드와 동일하게 사용)
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
