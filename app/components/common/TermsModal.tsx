'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Image from 'next/image';
import iconBack from '../../assets/icons/icon_back.svg';
import { useState } from 'react';

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
  max-height: 90vh;
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
  margin-bottom: 0.5rem;

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
      ? 'var(--brown, #473728)'
      : 'var(--black, linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), #171612)'};
  color: var(--ivory, #e5dcca);

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

  font-size: 1.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1.5rem;
`;

const ModalSubtitle = styled.div`
  color: var(--ivory, #e5dcca);

  font-size: 0.75rem;
  font-style: normal;
  font-weight: 800;
  line-height: 1rem;
  margin-top: 1rem;
`;

const P = styled.p`
  color: var(--ivory, #e5dcca);

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

  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 0.5rem;
`;

const Ol = styled.ol`
  padding-left: 20px;
  color: var(--ivory, #e5dcca);

  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 0.5rem;
`;

type ModalContentType = 'terms' | 'privacy' | 'refund';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [modalContent, setModalContent] = useState<ModalContentType>('terms');

  const modalContents = {
    terms: (
      <>
        <ModalTitle>이용약관</ModalTitle>
        <ModalSubtitle>제 1조 (목적)</ModalSubtitle>
        <P>
          이 약관은 토스트잇의 이용 조건 및 절차, 회원과 서비스 제공자의 권리, 의무 및 책임 사항을
          규정함을 목적으로 합니다.
        </P>
        <ModalSubtitle>제 2조 (정의)</ModalSubtitle>
        <Ol>
          <li>
            &quot;서비스&quot;란 [토스트잇 팀]이 제공하는 메모 관련 모바일 웹 서비스를 의미합니다.
          </li>
          <li>
            &quot;회원&quot;이란 서비스에 가입하여 이 약관에 따라 서비스를 이용하는 자를 의미합니다.
          </li>
          <li>
            &quot;유료 멤버십&quot;이란 회원이 추가 요금을 지불하고 이용할 수 있는 프리미엄 서비스
            기능을 의미합니다.
          </li>
          <li>&quot;토스트&quot;란 회원이 서비스에 저장한 메모 데이터를 의미합니다.</li>
          <li>
            &quot;갤러리&quot;란 회원이 서비스에 저장된 &quot;토스트&quot;가 카테고리 별로
            분류되어있는, 열람이 가능한 창을 의미합니다.
          </li>
        </Ol>
        <ModalSubtitle>제 3조 (회원가입 및 계정 관리)</ModalSubtitle>
        <Ol>
          <li>회원가입은 이메일 및 비밀번호를 이용하거나 카카오톡 계정을 통해 가능합니다.</li>
          <li>만 14세 미만의 사용자는 회원가입이 제한됩니다.</li>
          <li>
            회원은 정확하고 최신의 정보를 제공해야 하며, 이를 위반하여 발생한 불이익에 대한 책임은
            회원에게 있습니다.
          </li>
          <li>
            계정 정보 관리 책임은 회원에게 있으며, 회원은 계정을 제3자와 공유하거나 양도할 수
            없습니다.
          </li>
        </Ol>
        <ModalSubtitle>제 4조 (서비스 제공 및 변경)</ModalSubtitle>
        <Ol>
          <li>
            서비스는 회원의 메모 작성, 저장, 카테고리화, 불러오기, 갤러리 열람 기능을 제공합니다.
          </li>
          <li>
            서비스는 회원의 데이터를 저장하지만, 공유 기능은 지원하지 않으며, 복사/붙여넣기를
            통해서만 메모를 외부로 공유할 수 있습니다.
          </li>
          <li>
            유료 멤버십 구독 시 아래와 같은 추가 기능이 제공됩니다:
            <Ul>
              <li>메모 제목이 없는 경우 AI 기반 자동 요약 기능</li>
              <li>메모 RECAP 기능</li>
              <li>8개의 방위로 구성된 카테고리 제공</li>
            </Ul>
          </li>
          <li>
            서비스 내용은 운영상, 기술상의 필요에 따라 변경될 수 있으며, 변경 사항은 사전에
            공지합니다.
          </li>
          <li>서비스 종료 시, 남은 유료 멤버십 기간에 대한 비례 환불이 제공됩니다.</li>
        </Ol>
        <ModalSubtitle>제 5조 (개인정보 보호)</ModalSubtitle>
        <Ol>
          <li>
            회사는 회원의 개인정보를 &quot;개인정보처리방침&quot;에 따라 보호하며, 회원은 이를
            확인할 수 있습니다.
          </li>
          <li>
            회원의 개인정보는 회원의 동의 없이 제3자에게 제공되지 않습니다. 단, 법률에 의거한 요청은
            예외로 합니다.
          </li>
          <li>
            회원의 개인정보는 서비스 종료 또는 회원 탈퇴 시, 최대 90일 이내에 안전하게 삭제됩니다.
          </li>
        </Ol>
        <ModalSubtitle>제 6조 (회원의 의무)</ModalSubtitle>
        <Ol>
          <li>
            회원은 서비스를 이용함에 있어 다음 행위를 해서는 안 됩니다:
            <Ul>
              <li>타인의 계정을 도용하거나 부정 이용하는 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>악성 코드를 배포하거나 비정상적인 방식으로 서버에 과부하를 유발하는 행위</li>
              <li>기타 법령 및 약관을 위반하는 행위</li>
            </Ul>
          </li>
          <li>
            회원은 서비스 이용 시 본인의 데이터를 정기적으로 백업해야 하며, 데이터 손실에 대한
            책임은 회원에게 있습니다.
          </li>
        </Ol>
        <ModalSubtitle>제 7조 (서비스 중단)</ModalSubtitle>
        <Ol>
          <li>
            회사는 천재지변, 시스템 장애, 운영 상의 필요 등으로 서비스 제공을 일시적으로 중단할 수
            있습니다.
          </li>
          <li>서비스 중단 시 회원에게 사전 공지하며, 불가피한 경우 사후 공지할 수 있습니다.</li>
          <li>
            서비스 중단으로 인해 회원이 입은 피해에 대해서는 회사의 고의 또는 중대한 과실이 없는 한
            책임을 지지 않습니다.
          </li>
        </Ol>
        <ModalSubtitle>제 8조 (유료 멤버십 및 결제)</ModalSubtitle>
        <Ol>
          <li>
            유료 멤버십 구독은 회원의 선택 사항이며, 결제는 사전에 명시된 방법에 따라 이루어집니다.
          </li>
          <li>결제 취소 및 환불은 관련 법률 및 회사의 &quot;결제 및 환불 정책&quot;에 따릅니다.</li>
          <li>미성년자는 법정대리인의 동의 없이 유료 멤버십 구독이 불가능합니다.</li>
          <li>
            결제 실패 시, 회사는 회원에게 이를 통지하고, 지정된 기간 내에 결제 방법을 수정할 기회를
            제공합니다.
          </li>
        </Ol>
        <ModalSubtitle>제 9조 (책임 제한)</ModalSubtitle>
        <Ol>
          <li>회사는 회원이 서비스에 저장한 데이터의 내용에 대해 책임을 지지 않습니다.</li>
          <li>회사는 회원의 귀책 사유로 발생한 손해에 대해 책임을 지지 않습니다.</li>
          <li>
            회사는 기술적 오류로 인한 데이터 손실에 대해 최대한 복구를 지원하나, 이를 보장하지는
            않습니다.
          </li>
        </Ol>
        <ModalSubtitle>제 10조 (분쟁 해결 및 기타)</ModalSubtitle>
        <Ol>
          <li>이 약관과 관련하여 발생한 분쟁은 대한민국 법령을 따릅니다.</li>
          <li>
            회사와 회원 간 분쟁은 상호 협의하여 해결하며, 협의가 어려울 경우 관할 법원에 해결을
            요청할 수 있습니다.
          </li>
        </Ol>
        <ModalSubtitle>부칙</ModalSubtitle>
        <P>이 약관은 2025년 2월 15일부터 시행됩니다.</P>
      </>
    ),
    privacy: (
      <>
        <ModalTitle>개인정보처리방침</ModalTitle>
        <ModalSubtitle>제 1조 (개인정보의 수집 항목 및 방법)</ModalSubtitle>
        <Ol>
          <li>
            회사는 다음과 같은 개인정보를 수집합니다:
            <Ul>
              <li>회원가입 시: 이메일 주소, 비밀번호, 카카오톡 계정 정보(선택 시).</li>
              <li>서비스 이용 시: 기기 정보(운영 체제, 브라우저 등), 접속 IP, 이용 기록.</li>
              <li>유료 멤버십 구독 시: 결제 정보(카드사명, 결제 승인 번호 등).</li>
            </Ul>
          </li>
          <li>개인정보는 회원가입, 서비스 제공, 고객 지원 등을 목적으로 수집됩니다.</li>
        </Ol>
        <ModalSubtitle>제 2조 (개인정보의 이용 목적)</ModalSubtitle>
        <Ol>
          <li>
            개인정보는 다음 목적으로 이용됩니다:
            <Ul>
              <li>회원 관리: 회원 인증, 계정 보호, 고객 문의 처리.</li>
              <li>서비스 제공: 메모 저장, RECAP 기능 제공, AI 기반 요약 등.</li>
              <li>서비스 개선: 서비스 사용 통계 분석 및 품질 향상.</li>
              <li>법적 의무 이행: 관련 법령에 따른 보관 및 보고.</li>
            </Ul>
          </li>
        </Ol>
        <ModalSubtitle>제 3조 (개인정보의 보관 및 파기)</ModalSubtitle>
        <Ol>
          <li>
            회사는 법령에서 정한 기간 동안 개인정보를 보관합니다. 이후에는 해당 정보를 즉시
            파기합니다.
          </li>
          <li>
            개인정보 보관 및 파기 기준:
            <Ul>
              <li>회원 정보: 회원 탈퇴 시 즉시 파기.</li>
              <li>거래 정보: 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 5년간 보관.</li>
            </Ul>
          </li>
          <li>
            개인정보는 다음 방법으로 파기됩니다:
            <Ul>
              <li>전자적 파일: 복구할 수 없도록 영구 삭제.</li>
              <li>출력물: 파쇄 또는 소각 처리.</li>
            </Ul>
          </li>
        </Ol>
        <ModalSubtitle>제 4조 (개인정보의 제3자 제공)</ModalSubtitle>
        <Ol>
          <li>회사는 회원의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</li>
          <li>
            단, 다음 경우에는 예외로 합니다:
            <Ul>
              <li>법령에 따른 요구가 있을 경우.</li>
              <li>서비스 제공을 위해 결제 대행사 등과 최소한의 정보를 공유하는 경우.</li>
            </Ul>
          </li>
        </Ol>
        <ModalSubtitle>제 5조 (회원의 권리 및 행사 방법)</ModalSubtitle>
        <Ol>
          <li>회원은 언제든지 본인의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.</li>
          <li>
            회원의 요청은 회사 고객센터를 통해 접수되며, 회사는 법령에서 정한 기간 내에 처리합니다.
          </li>
          <li>개인정보 수정 또는 삭제 요청 시, 일부 서비스 이용이 제한될 수 있습니다.</li>
        </Ol>
        <ModalSubtitle>제 6조 (개인정보 보호를 위한 조치)</ModalSubtitle>
        <Ol>
          <li>
            회사는 다음과 같은 기술적/관리적 조치를 통해 개인정보를 보호합니다:
            <Ul>
              <li>데이터 암호화 및 안전한 저장.</li>
              <li>접근 권한 제어 및 정기 보안 점검.</li>
              <li>내부 보안 교육 및 정책 시행.</li>
            </Ul>
          </li>
        </Ol>
        <ModalSubtitle>제 7조 (개인정보 보호책임자 및 연락처)</ModalSubtitle>
        <Ol>
          <li>
            개인정보 보호책임자:
            <Ul>
              <li>이름: 김동민</li>
              <li>이메일: ehdals5387@gmail.com</li>
            </Ul>
          </li>
          <li>회원은 개인정보와 관련된 문의를 위 연락처를 통해 할 수 있습니다.</li>
        </Ol>
        <ModalSubtitle>제 8조 (개정 및 고지)</ModalSubtitle>
        <Ol>
          <li>이 개인정보처리방침은 2025년 1월 17일에 제정되었습니다.</li>
          <li>
            개인정보처리방침의 변경 사항은 서비스 공지사항 또는 이메일을 통해 사전 고지합니다.
          </li>
        </Ol>
      </>
    ),
    refund: (
      <>
        <ModalTitle>결제 및 환불정책</ModalTitle>
        <ModalSubtitle>제 1조 (결제 방식)</ModalSubtitle>
        <Ol>
          <li>
            유료 멤버십은 다음 결제 방식을 통해 구독할 수 있습니다:
            <Ul>
              <li>신용카드 및 체크카드</li>
              <li>간편결제 서비스 (예: 카카오페이, 네이버페이 등)</li>
              <li>기타 회사가 지정한 결제 방식</li>
            </Ul>
          </li>
          <li>
            결제는 회원이 선택한 방식에 따라 즉시 처리됩니다. 결제가 완료되면 회원은 서비스 이용
            권한을 즉시 부여받습니다.
          </li>
        </Ol>
        <ModalSubtitle>제 2조 (유료 멤버십 구독 조건)</ModalSubtitle>
        <Ol>
          <li>유료 멤버십은 월 단위로 구독할 수 있으며, 자동 갱신됩니다.</li>
          <li>자동 갱신을 원하지 않는 경우, 다음 결제일 이전에 구독 해지를 요청해야 합니다.</li>
          <li>미성년자는 법정대리인의 동의 없이 유료 멤버십을 구독할 수 없습니다.</li>
        </Ol>
        <ModalSubtitle>제 3조 (환불 정책)</ModalSubtitle>
        <Ol>
          <li>
            유료 멤버십 구독 후 7일 이내에 서비스 이용 기록이 없는 경우, 회원은 전액 환불을 요청할
            수 있습니다.
          </li>
          <li>
            다음의 경우에는 환불이 제한될 수 있습니다:
            <Ul>
              <li>서비스 이용 기록이 있는 경우.</li>
              <li>이미 제공된 기간제 혜택에 해당하는 경우.</li>
            </Ul>
          </li>
          <li>
            환불 요청은 고객센터를 통해 접수되며, 요청 접수 후 최대 7영업일 이내에 처리됩니다.
          </li>
        </Ol>
        <ModalSubtitle>제 4조 (결제 실패 및 연체 처리)</ModalSubtitle>
        <Ol>
          <li>
            결제 실패 시 회사는 회원에게 이를 통지하며, 지정된 기간 내에 결제 정보를 갱신하거나
            수정할 기회를 제공합니다.
          </li>
          <li>지정된 기간 내 결제 실패가 지속될 경우, 유료 멤버십은 자동으로 중지됩니다.</li>
        </Ol>
        <ModalSubtitle>제 5조 (결제 정보의 관리)</ModalSubtitle>
        <Ol>
          <li>회원은 결제 정보의 정확성과 유효성을 유지해야 할 책임이 있습니다.</li>
          <li>결제 정보 변경은 서비스 내 설정 또는 고객센터를 통해 가능합니다.</li>
          <li>회사는 결제 정보 변경 과정에서 발생한 문제에 대해 책임지지 않습니다.</li>
        </Ol>
        <ModalSubtitle>제 6조 (서비스 종료 시 환불)</ModalSubtitle>
        <Ol>
          <li>
            회사가 서비스를 종료하는 경우, 회원의 남은 유료 멤버십 기간에 대해 비례 환불이
            제공됩니다.
          </li>
          <li>환불 절차 및 일정은 별도로 공지됩니다.</li>
        </Ol>
        <ModalSubtitle>제 7조 (문의 및 지원)</ModalSubtitle>
        <Ol>
          <li>
            결제 및 환불과 관련한 모든 문의는 다음 연락처를 통해 처리됩니다:
            <Ul>
              <li>이메일: shinboy3078@gmail.com</li>
              <li>전화번호: 010-4194-6578</li>
            </Ul>
          </li>
          <li>
            회사는 회원의 문의를 최대한 신속하게 처리하며, 법령에 따라 필요한 경우 추가적인 서류를
            요청할 수 있습니다.
          </li>
        </Ol>
        <ModalSubtitle>제 8조 (개정 및 고지)</ModalSubtitle>
        <Ol>
          <li>이 결제 및 환불 정책은 2025년 1월 17일에 제정되었습니다.</li>
          <li>정책의 변경 사항은 서비스 공지사항 또는 이메일을 통해 사전에 고지됩니다.</li>
        </Ol>
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
            <ModalButton onClick={() => setModalContent('terms')} active={modalContent === 'terms'}>
              이용약관
            </ModalButton>
            <ModalButton
              onClick={() => setModalContent('privacy')}
              active={modalContent === 'privacy'}
            >
              개인정보처리방침
            </ModalButton>
            <ModalButton
              onClick={() => setModalContent('refund')}
              active={modalContent === 'refund'}
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
