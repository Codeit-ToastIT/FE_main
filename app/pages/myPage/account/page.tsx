'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '../../../api/api';
import { useAuth } from '../../../context/AuthContext';
import Image from 'next/image';
import back from '../../../assets/icons/icon_back.svg';
import password from '../../../assets/icons/icon_lock.svg';
import terms from '../../../assets/icons/icon_filecheck.svg';
import logouticon from '../../../assets/icons/icon_out.svg';
import accountdelete from '../../../assets/icons/icon_profile_x_r.svg';

function AccountPageContent() {
  const [showTermsOverlay, setShowTermsOverlay] = useState(false);
  const router = useRouter();
  const { token, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // 전환 효과를 위한 상태 (fade‑out)
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 쿼리 파라미터로 이동한 경우 fade‑in 효과 적용 여부 확인
  const searchParams = useSearchParams();
  const shouldFadeIn = searchParams.get('fadeIn') === 'true';
  // 만약 shouldFadeIn이면 초기 opacity를 0으로 두고, 마운트 후에 true로 전환
  const [fadeIn, setFadeIn] = useState(shouldFadeIn ? false : true);
  useEffect(() => {
    if (shouldFadeIn) {
      const timeoutId = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldFadeIn]);

  // 로그아웃 처리 함수 (API 호출 포함)
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        logout();
        console.log('API 호출 성공');
        router.push('/');
      } else {
        const errorMsg = await response.text();
        console.error('로그아웃 API 실패:', errorMsg);
      }
    } catch (error) {
      console.error('로그아웃 API 호출 중 에러 발생:', error);
    }
  };

  // 회원 탈퇴 처리 함수 (비동기)
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
        router.push('/');
      } else {
        console.error('회원 탈퇴 실패');
      }
    } catch (error) {
      console.error('회원 탈퇴 중 에러 발생', error);
    }
  };

  // 비밀번호 변경 메뉴 클릭 시 fade‑out 효과 후 이동 (이동할 때 쿼리 파라미터로 fadeIn=true 전달)
  const handlePasswordChange = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('./account/currentPassword?fadeIn=true');
    }, 50);
  };

  return (
    <Container transitioning={isTransitioning} fadeIn={fadeIn}>
      <Header>
        <BackButton onClick={() => router.push('../createToastPage')}>
          <StyledImage src={back.src} alt="뒤로 가기" width={24} height={24} />
        </BackButton>
        <TitleWrapper>
          <TitleContainer>
            <Title>계정</Title>
          </TitleContainer>
        </TitleWrapper>
      </Header>

      <MenuContainer>
        <MenuItem onClick={handlePasswordChange}>
          <Icon>
            <IconWrapper>
              <StyledImage src={password.src} alt="비밀번호 변경" width={24} height={24} />
            </IconWrapper>
            <span>비밀번호 변경</span>
          </Icon>
        </MenuItem>
        <MenuItem onClick={() => setShowTermsOverlay(true)}>
          <Icon>
            <IconWrapper>
              <StyledImage src={terms.src} alt="이용 약관" width={24} height={24} />
            </IconWrapper>
            <span>이용 약관</span>
          </Icon>
        </MenuItem>
        <MenuItem onClick={() => setShowLogoutModal(true)}>
          <Icon>
            <IconWrapper>
              <StyledImage src={logouticon.src} alt="로그아웃" width={24} height={24} />
            </IconWrapper>
            <span>로그아웃</span>
          </Icon>
        </MenuItem>
        <MenuItem className="danger" onClick={() => setShowDeleteModal(true)}>
          <Icon>
            <IconWrapper>
              <StyledImage src={accountdelete.src} alt="회원 탈퇴" width={24} height={24} />
            </IconWrapper>
            <span>회원 탈퇴</span>
          </Icon>
        </MenuItem>
      </MenuContainer>

      {showTermsOverlay && (
        <TermsContainer show={showTermsOverlay}>
          <TermsOverlayHeader>
            <BackButton onClick={() => setShowTermsOverlay(false)}>
              <StyledImage src="/icon_back.svg" alt="뒤로 가기" width={24} height={24} />
            </BackButton>
          </TermsOverlayHeader>
          <ScrollableContent>
            {/* 아래는 원래 있던 약관 내용 전체입니다. */}
            <TermsTitle>이용약관</TermsTitle>
            <Clause>
              <ClauseNumber>제 1조 (목적)</ClauseNumber>
              <ClauseContent>
                이 약관은 토스트잇의 이용 조건 및 절차, 회원과 서비스 제공자의 권리, 의무 및 책임
                사항을 규정함을 목적으로 합니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 2조 (정의)</ClauseNumber>
              <ClauseContent>
                1. &quot;서비스&quot;란 [토스트잇 팀]이 제공하는 메모 관련 모바일 웹 서비스를
                의미합니다.
              </ClauseContent>
              <ClauseContent>
                2. &quot;회원&quot;이란 서비스에 가입하여 이 약관에 따라 서비스를 이용하는 자를
                의미합니다.
              </ClauseContent>
              <ClauseContent>
                3. &quot;유료 멤버십&quot;이란 회원이 추가 요금을 지불하고 이용할 수 있는 프리미엄
                서비스 기능을 의미합니다.
              </ClauseContent>
              <ClauseContent>
                4. &quot;토스트&quot;란 회원이 서비스에 저장한 메모 데이터를 의미합니다.
              </ClauseContent>
              <ClauseContent>
                5. &quot;갤러리&quot;란 회원이 서비스에 저장된 &quot;토스트&quot;가 카테고리 별로
                분류되어있는, 열람이 가능한 창을 의미합니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 3조 (회원가입 및 계정 관리)</ClauseNumber>
              <ClauseContent>
                1. 회원가입은 이메일 및 비밀번호를 이용하거나 카카오톡 계정을 통해 가능합니다.
              </ClauseContent>
              <ClauseContent>2. 만 14세 미만의 사용자는 회원가입이 제한됩니다.</ClauseContent>
              <ClauseContent>
                3. 회원은 정확하고 최신의 정보를 제공해야 하며, 이를 위반하여 발생한 불이익에 대한
                책임은 회원에게 있습니다.
              </ClauseContent>
              <ClauseContent>
                4. 계정 정보 관리 책임은 회원에게 있으며, 회원은 계정을 제3자와 공유하거나 양도할 수
                없습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 4조 (서비스 제공 및 변경)</ClauseNumber>
              <ClauseContent>
                1. 서비스는 회원의 메모 작성, 저장, 카테고리화, 불러오기, 갤러리 열람 기능을
                제공합니다.
              </ClauseContent>
              <ClauseContent>
                2. 서비스는 회원의 데이터를 저장하지만, 공유 기능은 지원하지 않으며, 복사/붙여넣기를
                통해서만 메모를 외부로 공유할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                3. 유료 멤버십 구독 시 아래와 같은 추가 기능이 제공됩니다:
                <ClauseContent className="bullet">
                  •⠀메모 제목이 없는 경우 AI 기반 자동 요약 기능
                </ClauseContent>
                <ClauseContent className="bullet">•⠀메모 RECAP 기능</ClauseContent>
                <ClauseContent className="bullet">
                  •⠀8개의 방위로 구성된 카테고리 제공
                </ClauseContent>
              </ClauseContent>
              <ClauseContent>
                4. 서비스 내용은 운영상, 기술상의 필요에 따라 변경될 수 있으며, 변경 사항은 사전에
                공지합니다.
              </ClauseContent>
              <ClauseContent>
                5. 서비스 종료 시, 남은 유료 멤버십 기간에 대한 비례 환불이 제공됩니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 5조 (개인정보 보호)</ClauseNumber>
              <ClauseContent>
                1. 회사는 회원의 개인정보를 &quot;개인정보처리방침&quot;에 따라 보호하며, 회원은
                이를 확인할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                2. 회원의 개인정보는 회원의 동의 없이 제3자에게 제공되지 않습니다. 단, 법률에 의거한
                요청은 예외로 합니다.
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
              <ClauseContent className="bullet">
                •⠀타인의 계정을 도용하거나 부정 이용하는 행위
              </ClauseContent>
              <ClauseContent className="bullet">
                •⠀서비스의 정상적인 운영을 방해하는 행위
              </ClauseContent>
              <ClauseContent className="bullet">
                •⠀악성 코드를 배포하거나 비정상적인 방식으로 서버에 과부하를 유발하는 행위
              </ClauseContent>
              <ClauseContent className="bullet">•⠀기타 법령 및 약관을 위반하는 행위</ClauseContent>
              <ClauseContent>
                2. 회원은 서비스 이용 시 본인의 데이터를 정기적으로 백업해야 하며, 데이터 손실에
                대한 책임은 회원에게 있습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 7조 (서비스 중단)</ClauseNumber>
              <ClauseContent>
                1. 회사는 천재지변, 시스템 장애, 운영 상의 필요 등으로 서비스 제공을 일시적으로
                중단할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                2. 서비스 중단 시 회원에게 사전 공지하며, 불가피한 경우 사후 공지할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                3. 서비스 중단으로 인해 회원이 입은 피해에 대해서는 회사의 고의 또는 중대한 과실이
                없는 한 책임을 지지 않습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 8조 (유료 멤버십 및 결제)</ClauseNumber>
              <ClauseContent>
                1. 유료 멤버십 구독은 회원의 선택 사항이며, 결제는 사전에 명시된 방법에 따라
                이루어집니다.
              </ClauseContent>
              <ClauseContent>
                2. 결제 취소 및 환불은 관련 법률 및 회사의 &quot;결제 및 환불 정책&quot;에 따릅니다.
              </ClauseContent>
              <ClauseContent>
                3. 미성년자는 법정대리인의 동의 없이 유료 멤버십 구독이 불가능합니다.
              </ClauseContent>
              <ClauseContent>
                4. 결제 실패 시, 회사는 회원에게 이를 통지하고, 지정된 기간 내에 결제 방법을 수정할
                기회를 제공합니다.
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
                3. 회사는 기술적 오류로 인한 데이터 손실에 대해 최대한 복구를 지원하나, 이를
                보장하지는 않습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 10조 (분쟁 해결 및 기타)</ClauseNumber>
              <ClauseContent>
                1. 이 약관과 관련하여 발생한 분쟁은 대한민국 법령을 따릅니다.
              </ClauseContent>
              <ClauseContent>
                2. 회사와 회원 간 분쟁은 상호 협의하여 해결하며, 협의가 어려울 경우 관할 법원에
                해결을 요청할 수 있습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>부칙</ClauseNumber>
              <ClauseContent>이 약관은 2025년 2월 15일부터 시행됩니다.</ClauseContent>
            </Clause>
            <TermsTitle>개인정보처리방침</TermsTitle>
            <Clause>
              <ClauseNumber>제 1조 (개인정보의 수집 항목 및 방법)</ClauseNumber>
              <ClauseContent>1. 회사는 다음과 같은 개인정보를 수집합니다:</ClauseContent>
              <ClauseContent className="bullet">
                •⠀회원가입 시: 이메일 주소, 비밀번호, 카카오톡 계정 정보(선택 시).
              </ClauseContent>
              <ClauseContent className="bullet">
                •⠀서비스 이용 시: 기기 정보(운영 체제, 브라우저 등), 접속 IP, 이용 기록.
              </ClauseContent>
              <ClauseContent className="bullet">
                •⠀유료 멤버십 구독 시: 결제 정보(카드사명, 결제 승인 번호 등).
              </ClauseContent>
              <ClauseContent>
                2. 개인정보는 회원가입, 서비스 제공, 고객 지원 등을 목적으로 수집됩니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 2조 (개인정보의 이용 목적)</ClauseNumber>
              <ClauseContent>1. 회원 관리: 회원 인증, 계정 보호, 고객 문의 처리.</ClauseContent>
              <ClauseContent>
                2. 서비스 제공: 메모 저장, RECAP 기능 제공, AI 기반 요약 등.
              </ClauseContent>
              <ClauseContent>3. 서비스 개선: 서비스 사용 통계 분석 및 품질 향상.</ClauseContent>
              <ClauseContent>4. 법적 의무 이행: 관련 법령에 따른 보관 및 보고.</ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 3조 (개인정보의 보관 및 파기)</ClauseNumber>
              <ClauseContent>
                1. 회사는 법령에서 정한 기간 동안 개인정보를 보관합니다. 이후에는 해당 정보를 즉시
                파기합니다.
              </ClauseContent>
              <ClauseContent className="bullet">•⠀회원 정보: 회원 탈퇴 시 즉시 파기.</ClauseContent>
              <ClauseContent className="bullet">
                •⠀거래 정보: 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 5년간 보관.
              </ClauseContent>
              <ClauseContent>2. 개인정보는 다음 방법으로 파기됩니다:</ClauseContent>
              <ClauseContent className="bullet">
                •⠀전자적 파일: 복구할 수 없도록 영구 삭제.
              </ClauseContent>
              <ClauseContent className="bullet">•⠀출력물: 파쇄 또는 소각 처리.</ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 4조 (개인정보의 제3자 제공)</ClauseNumber>
              <ClauseContent>
                1. 회사는 회원의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
              </ClauseContent>
              <ClauseContent>2. 단, 다음 경우에는 예외로 합니다:</ClauseContent>
              <ClauseContent className="bullet">•⠀법령에 따른 요구가 있을 경우.</ClauseContent>
              <ClauseContent className="bullet">
                •⠀서비스 제공을 위해 결제 대행사 등과 최소한의 정보를 공유하는 경우.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 5조 (회원의 권리 및 행사 방법)</ClauseNumber>
              <ClauseContent>
                1. 회원은 언제든지 본인의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.
              </ClauseContent>
              <ClauseContent>
                2. 회원의 요청은 회사 고객센터를 통해 접수되며, 회사는 법령에서 정한 기간 내에
                처리합니다.
              </ClauseContent>
              <ClauseContent>
                3. 개인정보 수정 또는 삭제 요청 시, 일부 서비스 이용이 제한될 수 있습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 6조 (개인정보 보호를 위한 조치)</ClauseNumber>
              <ClauseContent>
                1. 회사는 다음과 같은 기술적/관리적 조치를 통해 개인정보를 보호합니다:
              </ClauseContent>
              <ClauseContent className="bullet">•⠀데이터 암호화 및 안전한 저장.</ClauseContent>
              <ClauseContent className="bullet">•⠀접근 권한 제어 및 정기 보안 점검.</ClauseContent>
              <ClauseContent className="bullet">•⠀내부 보안 교육 및 정책 시행.</ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 7조 (개인정보 보호책임자 및 연락처)</ClauseNumber>
              <ClauseContent>1. 개인정보 보호책임자:</ClauseContent>
              <ClauseContent className="bullet">•⠀이름: 김동민</ClauseContent>
              <ClauseContent className="bullet">•⠀이메일: ehdals5387@gmail.com</ClauseContent>
              <ClauseContent>
                2. 회원은 개인정보와 관련된 문의를 위 연락처를 통해 할 수 있습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 8조 (개정 및 고지)</ClauseNumber>
              <ClauseContent>
                1. 이 개인정보처리방침은 2025년 1월 17일부터 시행됩니다.
              </ClauseContent>
              <ClauseContent>
                2. 개인정보처리방침의 변경 사항은 서비스 공지사항 또는 이메일을 통해 사전
                고지합니다.
              </ClauseContent>
            </Clause>
            <TermsTitle>결제 및 환불 정책</TermsTitle>
            <Clause>
              <ClauseNumber>제 1조 (결제 방식)</ClauseNumber>
              <ClauseContent>
                1. 유료 멤버십은 다음 결제 방식을 통해 구독할 수 있습니다:
              </ClauseContent>
              <ClauseContent className="bullet">•⠀신용카드 및 체크카드</ClauseContent>
              <ClauseContent className="bullet">
                •⠀간편결제 서비스 (예: 카카오페이, 네이버페이 등)
              </ClauseContent>
              <ClauseContent className="bullet">•⠀기타 회사가 지정한 결제 방식</ClauseContent>
              <ClauseContent>
                2. 결제는 회원이 선택한 방식에 따라 즉시 처리되며, 결제가 완료되면 서비스 이용
                권한을 즉시 부여받습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 2조 (유료 멤버십 구독 조건)</ClauseNumber>
              <ClauseContent>
                1. 유료 멤버십은 월 단위로 구독할 수 있으며, 자동 갱신됩니다.
              </ClauseContent>
              <ClauseContent>
                2. 자동 갱신을 원하지 않는 경우, 다음 결제일 이전에 구독 해지를 요청해야 합니다.
              </ClauseContent>
              <ClauseContent>
                3. 미성년자는 법정대리인의 동의 없이 유료 멤버십을 구독할 수 없습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 3조 (환불 정책)</ClauseNumber>
              <ClauseContent>
                1. 유료 멤버십 구독 후 7일 이내에 서비스 이용 기록이 없는 경우, 회원은 전액 환불을
                요청할 수 있습니다.
              </ClauseContent>
              <ClauseContent>2. 다음의 경우에는 환불이 제한됩니다:</ClauseContent>
              <ClauseContent className="bullet">•⠀서비스 이용 기록이 있는 경우.</ClauseContent>
              <ClauseContent className="bullet">
                •⠀이미 제공된 기간제 혜택에 해당하는 경우.
              </ClauseContent>
              <ClauseContent>
                3. 환불 요청은 고객센터를 통해 접수되며, 최대 7영업일 이내에 처리됩니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 4조 (결제 실패 및 연체 처리)</ClauseNumber>
              <ClauseContent>
                1. 결제 실패 시 회사는 회원에게 이를 통지하며, 지정된 기간 내에 결제 정보를
                갱신하거나 수정할 기회를 제공합니다.
              </ClauseContent>
              <ClauseContent>
                2. 지정된 기간 내 결제 실패가 지속되면 유료 멤버십은 자동으로 중지됩니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 5조 (결제 정보의 관리)</ClauseNumber>
              <ClauseContent>
                1. 회원은 결제 정보의 정확성과 유효성을 유지할 책임이 있습니다.
              </ClauseContent>
              <ClauseContent>
                2. 결제 정보 변경은 서비스 내 설정 또는 고객센터를 통해 가능합니다.
              </ClauseContent>
              <ClauseContent>
                3. 회사는 결제 정보 변경 과정에서 발생한 문제에 대해 책임지지 않습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 6조 (서비스 종료 시 환불)</ClauseNumber>
              <ClauseContent>
                1. 회사가 서비스를 종료하는 경우, 회원의 남은 유료 멤버십 기간에 대해 비례 환불이
                제공됩니다.
              </ClauseContent>
              <ClauseContent>2. 환불 절차 및 일정은 별도로 공지됩니다.</ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 7조 (문의 및 지원)</ClauseNumber>
              <ClauseContent>
                1. 결제 및 환불과 관련한 모든 문의는 다음 연락처를 통해 처리됩니다:
              </ClauseContent>
              <ClauseContent className="bullet">•⠀이메일: shinboy3078@gmail.com</ClauseContent>
              <ClauseContent className="bullet">•⠀전화번호: 010-4194-6578</ClauseContent>
              <ClauseContent>
                2. 회사는 회원의 문의를 최대한 신속하게 처리하며, 법령에 따라 필요한 경우 추가적인
                서류를 요청할 수 있습니다.
              </ClauseContent>
            </Clause>
            <Clause>
              <ClauseNumber>제 8조 (개정 및 고지)</ClauseNumber>
              <ClauseContent>
                1. 이 결제 및 환불 정책은 2025년 1월 17일 에 제정되었습니다.
              </ClauseContent>
              <ClauseContent>
                2. 정책의 변경 사항은 서비스 공지사항 또는 이메일을 통해 사전에 고지됩니다.
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
              <CancelButton onClick={() => setShowLogoutModal(false)}>취소</CancelButton>
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
              <CancelButton onClick={() => setShowDeleteModal(false)}>취소</CancelButton>
              <DeleteButton onClick={handleDeleteAccount}>탈퇴</DeleteButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      <Footer>앱 버전 1.0.0</Footer>
    </Container>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountPageContent />
    </Suspense>
  );
}

const Container = styled.div<{ transitioning: boolean; fadeIn: boolean }>`
  width: 100%;
  height: 100vh;
  background-color: var(--ivory, #e5dcca);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* transitioning이 true이거나 fadeIn이 false이면 opacity 0, 그렇지 않으면 1 */
  opacity: ${({ transitioning, fadeIn }) => (transitioning || !fadeIn ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
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
  height: 40px;
`;

const Title = styled.h1`
  font-size: 16px;
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

const TermsContainer = styled.div<{ show: boolean }>`
  width: 375px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  position: absolute;
  top: ${({ show }) => (show ? '0' : '100%')};
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
  width: 100%;
  overflow-y: auto;
  padding: 16px 24px;
  gap: 12px;
  align-self: stretch;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TermsTitle = styled.h2`
  color: var(--ivory, #e5dcca);
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
  padding: 1px;

  &.bullet {
    margin-left: 23px;
  }
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
  width: 280px;
  height: 160px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  padding: 20px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin: 22px;
  margin-bottom: 0px;
`;

const ModalDescription = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #888;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  width: 98px;
  height: 40px;
  padding: 12px 18px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #974b00;
  font-weight: bold;
  cursor: pointer;
  width: 98px;
  height: 40px;
  padding: 12px 18px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #974b00;
  font-weight: bold;
  cursor: pointer;
  width: 98px;
  height: 40px;
  padding: 12px 18px;
`;

const StyledImage = styled(Image)``;
