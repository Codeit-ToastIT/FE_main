"use client";

import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Image from "next/image";
import iconBack from "../../assets/icons/icon_back.svg";
import { useState } from "react";

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 0.5rem;
  align-items: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
`;

const IconBack = styled(Image)`
  align-self: flex-start;
  cursor: pointer;
`;

const IconButton = styled.div`
  display: inline-flex;
  padding: 0.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 2.5rem;
  background: var(
    --black,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #171612
  );
  overflow: hidden;
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  border-radius: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const ModalButton = styled.div<{ active?: boolean }>`
  display: inline-flex;
  padding: 0.625rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 2.5rem;
  background: ${({ active }) =>
    active
      ? "var(--brown, #473728)"
      : "var(--black, linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), #171612)"};
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 1rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1.25rem;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  cursor: pointer;

  &:hover {
    background: var(--brown, #473728);
  }
`;

const ModalTitle = styled.div`
  align-self: stretch;
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1.5rem;
`;

const ModalSubtitle = styled.div`
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1rem;
  margin-top: 1rem;
`;

const P = styled.p`
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 0.5rem;
`;

const Ul = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  color: var(--ivory, #e5dcca);
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 0.5rem;
`;

type ModalContentType = "terms" | "privacy" | "refund";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [modalContent, setModalContent] = useState<ModalContentType>("terms");

  const modalContents = {
    terms: (
      <>
        <ModalTitle>이용약관</ModalTitle>
        <ModalSubtitle>제 1조 (목적)</ModalSubtitle>
        <P>
          이 약관은 토스트잇의 이용 조건 및 절차, 회원과 서비스 제공자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
        </P>
        <ModalSubtitle>제 2조 (정의)</ModalSubtitle>
        <P>{`1. "서비스"란 [토스트잇 팀]이 제공하는 메모 관련 모바일 웹 서비스를 의미합니다.`}</P>
        <P>{`2. "회원"이란 서비스에 가입하여 이 약관에 따라 서비스를 이용하는 자를 의미합니다.`}</P>
        <P>{`3. "유료 멤버십"이란 회원이 추가 요금을 지불하고 이용할 수 있는 프리미엄 서비스 기능을 의미합니다.`}</P>
        <P>{`4. "토스트"란 회원이 서비스에 저장한 메모 데이터를 의미합니다.`}</P>
        <P>{`5. "갤러리"란 회원이 서비스에 저장된 "토스트"가 카테고리 별로 분류되어있는, 열람이 가능한 창을 의미합니다.`}</P>
        <ModalSubtitle>제 3조 (회원가입 및 계정 관리)</ModalSubtitle>
        <P>{`1. 회원가입은 이메일 및 비밀번호를 이용하거나 카카오톡 계정을 통해 가능합니다.`}</P>
        <P>{`2. 만 14세 미만의 사용자는 회원가입이 제한됩니다.`}</P>
        <P>{`3. 회원은 정확하고 최신의 정보를 제공해야 하며, 이를 위반하여 발생한 불이익에 대한 책임은 회원에게 있습니다.`}</P>
        <P>{`4. 계정 정보 관리 책임은 회원에게 있으며, 회원은 계정을 제3자와 공유하거나 양도할 수 없습니다.`}</P>
        <ModalSubtitle>제 4조 (서비스 제공 및 변경)</ModalSubtitle>
        <P>1. 서비스는 회원의 메모 작성, 저장, 카테고리화, 불러오기, 갤러리 열람 기능을 제공합니다.</P>
        <P>2. 서비스는 회원의 데이터를 저장하지만, 공유 기능은 지원하지 않으며, 복사/붙여넣기를 통해서만 메모를 외부로 공유할 수 있습니다.</P>
        <P>3. 유료 멤버십 구독 시 아래와 같은 추가 기능이 제공됩니다:</P>
        <Ul>
          <li>메모 제목이 없는 경우 AI 기반 자동 요약 기능</li>
          <li>메모 RECAP 기능</li>
          <li>8개의 방위로 구성된 카테고리 제공</li>
        </Ul>
        <P>4. 서비스 내용은 운영상, 기술상의 필요에 따라 변경될 수 있으며, 변경 사항은 사전에 공지합니다. 서비스 종료 시, 남은 유료 멤버십 기간에 대한 비례 환불이 제공됩니다.</P>
      </>
    ),
    privacy: (
      <>
        <ModalTitle>개인정보처리방침</ModalTitle>
        <ModalSubtitle>제 1조 (개인정보의 수집 및 이용 목적)</ModalSubtitle>
        <P>
          토스트잇은 회원의 개인정보를 다음과 같은 목적으로 수집 및 이용합니다.
        </P>
        <Ul>
          <li>회원 가입 및 관리</li>
          <li>서비스 제공 및 개선</li>
          <li>마케팅 및 광고 활용</li>
        </Ul>
        <ModalSubtitle>제 2조 (수집하는 개인정보의 항목)</ModalSubtitle>
        <P>1. 회원가입 시: 이메일, 비밀번호, 카카오톡 계정 정보</P>
        <P>2. 서비스 이용 시: 메모 데이터, 이용 기록</P>
      </>
    ),
    refund: (
      <>
        <ModalTitle>결제 및 환불정책</ModalTitle>
        <ModalSubtitle>제 1조 (결제)</ModalSubtitle>
        <P>
          유료 멤버십 결제는 월간 또는 연간 구독 형태로 제공됩니다.
        </P>
        <ModalSubtitle>제 2조 (환불)</ModalSubtitle>
        <P>
          환불은 구독 기간 남은 일수에 따라 비례 계산되며, 환불 요청은 고객센터를 통해 가능합니다.
        </P>
      </>
    ),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModalHeader>
            <IconButton onClick={onClose}>
              <IconBack src={iconBack} alt="뒤로가기" />
            </IconButton>
            <ModalButton
              onClick={() => setModalContent("terms")}
              active={modalContent === "terms"}
            >
              이용약관
            </ModalButton>
            <ModalButton
              onClick={() => setModalContent("privacy")}
              active={modalContent === "privacy"}
            >
              개인정보처리방침
            </ModalButton>
            <ModalButton
              onClick={() => setModalContent("refund")}
              active={modalContent === "refund"}
            >
              결제 및 환불정책
            </ModalButton>
          </ModalHeader>
          <ModalContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {modalContents[modalContent]}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}