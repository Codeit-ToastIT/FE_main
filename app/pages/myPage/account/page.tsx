'use client';

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

// 계정 메뉴
const AccountPage = () => {
  const [showTermsOverlay, setShowTermsOverlay] = useState(false);
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 로그아웃 처리 함수 (API 호출 포함)
  const handleLogout = async () => {
    try {
      const token = "YOUR_BEARER_TOKEN";
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        router.push("/");
      } else {
        const errorMsg = await response.text();
        console.error("로그아웃 API 실패:", errorMsg);
      }
    } catch (error) {
      console.error("로그아웃 API 호출 중 에러 발생:", error);
    }
  };

  // 회원 탈퇴 처리 함수 (비동기)
  const handleDeleteAccount = async () => {
    try {
      const token = "YOUR_BEARER_TOKEN";
      const response = await fetch("/api/deleteAccount", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 필요 시 인증 토큰 등을 헤더에 추가
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        router.push("/");
      } else {
        console.error("회원 탈퇴 실패");
      }
    } catch (error) {
      console.error("회원 탈퇴 중 에러 발생", error);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <img src="/icon_back.svg" alt="뒤로 가기" />
        </BackButton>
        <TitleWrapper>
          <TitleContainer>
            <Title>계정</Title>
          </TitleContainer>
        </TitleWrapper>
      </Header>

      <MenuContainer>
        {/* 비밀번호 변경 버튼: 클릭 시 지정된 페이지로 이동 (주소는 플레이스홀더) */}
        <MenuItem onClick={() => router.push("./account/currentPassword")}>
          <Icon>
            <IconWrapper>
              <img src="/icon_lock.svg" alt="비밀번호 변경" />
            </IconWrapper>
            <span>비밀번호 변경</span>
          </Icon>
        </MenuItem>
        <MenuItem onClick={() => setShowTermsOverlay(true)}>
          <Icon>
            <IconWrapper>
              <img src="/icon_filecheck.svg" alt="이용 약관" />
            </IconWrapper>
            <span>이용 약관</span>
          </Icon>
        </MenuItem>
        <MenuItem onClick={() => setShowLogoutModal(true)}>
          <Icon>
            <IconWrapper>
              <img src="/icon_out.svg" alt="로그아웃" />
            </IconWrapper>
            <span>로그아웃</span>
          </Icon>
        </MenuItem>
        <MenuItem className="danger" onClick={() => setShowDeleteModal(true)}>
          <Icon>
            <IconWrapper>
              <img src="/icon_profile_x.svg" alt="회원 탈퇴" />
            </IconWrapper>
            <span>회원 탈퇴</span>
          </Icon>
        </MenuItem>
      </MenuContainer>

      {showTermsOverlay && (
        <TermsContainer show={showTermsOverlay}>
          <TermsOverlayHeader>
            <BackButton onClick={() => setShowTermsOverlay(false)}>
              <img src="/icon_back.svg" alt="뒤로 가기" />
            </BackButton>
          </TermsOverlayHeader>
          <ScrollableContent>
            <TermsTitle>이용약관</TermsTitle>
            <Clause>
              <ClauseNumber>제 1조 (목적)</ClauseNumber>
              <ClauseContent>
                이 약관은 토스트잇의 이용 조건 및 절차, 회원과 서비스 제공자의
                권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 2조 (정의)</ClauseNumber>
              <ClauseContent>
                1. "서비스"란 [토스트잇 팀]이 제공하는 메모 관련 모바일 웹 서비스를
                의미합니다.
              </ClauseContent>
              <ClauseContent>
                2. "회원"이란 서비스에 가입하여 이 약관에 따라 서비스를 이용하는 자를
                의미합니다.
              </ClauseContent>
              <ClauseContent>
                3. "유료 멤버십"이란 회원이 추가 요금을 지불하고 이용할 수 있는 프리미엄
                서비스 기능을 의미합니다.
              </ClauseContent>
              <ClauseContent>
                4. "토스트"란 회원이 서비스에 저장한 메모 데이터를 의미합니다.
              </ClauseContent>
              <ClauseContent>
                5. "갤러리"란 회원이 서비스에 저장된 "토스트"가 카테고리 별로 분류되어있는,
                열람이 가능한 창을 의미합니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 3조 (회원가입 및 계정 관리)</ClauseNumber>
              <ClauseContent>
                1. 회원가입은 이메일 및 비밀번호를 이용하거나 카카오톡 계정을 통해 가능합니다.
              </ClauseContent>
              <ClauseContent>
                2. 만 14세 미만의 사용자는 회원가입이 제한됩니다.
              </ClauseContent>
              <ClauseContent>
                3. 회원은 정확하고 최신의 정보를 제공해야 하며, 이를 위반하여 발생한
                불이익에 대한 책임은 회원에게 있습니다.
              </ClauseContent>
              <ClauseContent>
                4. 계정 정보 관리 책임은 회원에게 있으며, 회원은 계정을 제3자와 공유하거나
                양도할 수 없습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 4조 (서비스 제공 및 변경)</ClauseNumber>
              <ClauseContent>
                1. 서비스는 회원의 메모 작성, 저장, 카테고리화, 불러오기, 갤러리 열람
                기능을 제공합니다.
              </ClauseContent>
              <ClauseContent>
                2. 서비스는 회원의 데이터를 저장하지만, 공유 기능은 지원하지 않으며,
                복사/붙여넣기를 통해서만 메모를 외부로 공유할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                3. 유료 멤버십 구독 시 아래와 같은 추가 기능이 제공됩니다: 메모 제목이 없는
                경우 AI 기반 자동 요약 기능, 메모 RECAP 기능, 8개의 방위로 구성된 카테고리 제공.
              </ClauseContent>
              <ClauseContent>
                4. 서비스 내용은 운영상, 기술상의 필요에 따라 변경될 수 있으며, 변경 사항은
                사전에 공지합니다.
              </ClauseContent>
              <ClauseContent>
                5. 서비스 종료 시, 남은 유료 멤버십 기간에 대한 비례 환불이 제공됩니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 5조 (개인정보 보호)</ClauseNumber>
              <ClauseContent>
                1. 회사는 회원의 개인정보를 "개인정보처리방침"에 따라 보호하며, 회원은
                이를 확인할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                2. 회원의 개인정보는 회원의 동의 없이 제3자에게 제공되지 않습니다. 단,
                법률에 의거한 요청은 예외로 합니다.
              </ClauseContent>
              <ClauseContent>
                3. 회원의 개인정보는 서비스 종료 또는 회원 탈퇴 시, 최대 90일 이내에 안전하게
                삭제됩니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 6조 (회원의 의무)</ClauseNumber>
              <ClauseContent>
                1. 회원은 서비스를 이용함에 있어 다음 행위를 해서는 안 됩니다:
              </ClauseContent>
              <ClauseContent>
                - 타인의 계정을 도용하거나 부정 이용하는 행위
              </ClauseContent>
              <ClauseContent>
                - 서비스의 정상적인 운영을 방해하는 행위
              </ClauseContent>
              <ClauseContent>
                - 악성 코드를 배포하거나 비정상적인 방식으로 서버에 과부하를 유발하는 행위
              </ClauseContent>
              <ClauseContent>
                - 기타 법령 및 약관을 위반하는 행위
              </ClauseContent>
              <ClauseContent>
                2. 회원은 서비스 이용 시 본인의 데이터를 정기적으로 백업해야 하며, 데이터 손실에 대한
                책임은 회원에게 있습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 7조 (서비스 중단)</ClauseNumber>
              <ClauseContent>
                1. 회사는 천재지변, 시스템 장애, 운영 상의 필요 등으로 서비스 제공을
                일시적으로 중단할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                2. 서비스 중단 시 회원에게 사전 공지하며, 불가피한 경우 사후 공지할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                3. 서비스 중단으로 인해 회원이 입은 피해에 대해서는 회사의 고의 또는 중대한 과실이 없는 한
                책임을 지지 않습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 8조 (유료 멤버십 및 결제)</ClauseNumber>
              <ClauseContent>
                1. 유료 멤버십 구독은 회원의 선택 사항이며, 결제는 사전에 명시된 방법에 따라 이루어집니다.
              </ClauseContent>
              <ClauseContent>
                2. 결제 취소 및 환불은 관련 법률 및 회사의 "결제 및 환불 정책"에 따릅니다.
              </ClauseContent>
              <ClauseContent>
                3. 미성년자는 법정대리인의 동의 없이 유료 멤버십 구독이 불가능합니다.
              </ClauseContent>
              <ClauseContent>
                4. 결제 실패 시, 회사는 회원에게 이를 통지하고, 지정된 기간 내에 결제 방법을 수정할 기회를 제공합니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 9조 (책임 제한)</ClauseNumber>
              <ClauseContent>
                1. 회사는 회원이 서비스에 저장한 데이터의 내용에 대해 책임을 지지 않습니다.
              </ClauseContent>
              <ClauseContent>
                2. 회사는 회원의 귀책 사유로 발생한 손해에 대해 책임을 지지 않습니다.
              </ClauseContent>
              <ClauseContent>
                3. 회사는 기술적 오류로 인한 데이터 손실에 대해 최대한 복구를 지원하나, 이를 보장하지는 않습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 10조 (분쟁 해결 및 기타)</ClauseNumber>
              <ClauseContent>
                1. 이 약관과 관련하여 발생한 분쟁은 대한민국 법령을 따릅니다.
              </ClauseContent>
              <ClauseContent>
                2. 회사와 회원 간 분쟁은 상호 협의하여 해결하며, 협의가 어려울 경우 관할 법원에 해결을 요청할 수 있습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>부칙</ClauseNumber>
              <ClauseContent>
                이 약관은 2025년 2월 15일부터 시행됩니다.
              </ClauseContent>
            </Clause>
          </ScrollableContent>
        </TermsContainer>
      )}

      {showLogoutModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>로그아웃 할까요?</ModalTitle>
            <ModalDescription>로그아웃해도 메모는 남아있어요.</ModalDescription>
            <ModalActions>
              <CancelButton onClick={() => setShowLogoutModal(false)}>
                취소
              </CancelButton>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
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
              <CancelButton onClick={() => setShowDeleteModal(false)}>
                취소
              </CancelButton>
              <DeleteButton onClick={handleDeleteAccount}>탈퇴</DeleteButton>
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
  backdrop-filter: blur(4px);
  position: absolute;
  top: ${({ show }) => (show ? "0" : "100%")};
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: top 0.3s ease-in-out;
`;

const TermsOverlayHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px;
`;

const ScrollableContent = styled.div`
  flex: 1;
  width: 343px;
  overflow-y: auto;
  padding: 0 16px;
  
  /* 스크롤바 숨기기 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TermsTitle = styled.h2`
  color: var(--ivory, #E5DCCA);
  font-family: SUIT;
  font-size: 20px;
  font-style: normal;
  font-weight: 800;
  line-height: 24px;
  align-self: stretch;
`;

const Clause = styled.div`
  font-size: 12px;
`;

const ClauseNumber = styled.div`
  font-weight: bold;
  color: #f5e8d6;
  margin-top: 12px;
`;

const ClauseContent = styled.div`
  font-weight: normal;
  color: #f5e8d6;
  padding: 4px 0;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: var(--ivory, #E5DCCA);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 343px;
  display: flex;
  align-items: center;
  background-color: transparent;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
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
  border-radius: 24px;
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
  display: flex;
  width: 375px;
  padding: 8px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  gap: 16px;
  align-self: stretch;
  font-weight: bold;
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

  &.danger {
    color: red;
  }
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  gap: 16px;

  & > img {
    display: block;
  }

  & > span {
    transform: translateY(0px);
  }
`;

const IconWrapper = styled.div`
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  font-size: 12px;
  color: #000;
  text-align: center;
  margin: 20px;
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
