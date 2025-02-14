import React, { useState } from 'react';
import styled from 'styled-components';
import DeleteMotionModal from './DeleteMotionModal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => Promise<boolean>; // ✅ 삭제 성공 여부를 반환하는 비동기 함수로 변경
  toastNumber: number; // ✅ toastNumber 추가
}

export default function DeleteModal({ isOpen, onClose, onClick, toastNumber }: ModalProps) {
  const [showMotion, setShowMotion] = useState(false); // ✅ 삭제 애니메이션 모달 표시 여부
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false); // ✅ 삭제 성공 여부

  if (!isOpen) return null;

  return (
    <>
      {!showMotion ? (
        // ✅ 기존 삭제 확인 모달
        <Overlay onClick={onClose}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <Message>
              이 토스트를 먹어버릴까요?
              <br />
              <MessageSmall>먹은 토스트는 삭제돼요.</MessageSmall>
            </Message>

            <ButtonContainer>
              <CancelButton onClick={onClose}>취소</CancelButton>
              <DeleteButton
                onClick={async () => {
                  setShowMotion(true); // ✅ 먼저 애니메이션 모달 실행

                  setTimeout(async () => {
                    const success = await onClick(); // ✅ 0.9초 후 삭제 실행
                    setIsDeleteSuccess(success);

                    if (success) {
                      setTimeout(() => {
                        setShowMotion(false); // ✅ 애니메이션 모달 숨김
                        onClose(); // ✅ 모달 닫기
                      }, 100); // ✅ 0.1초 뒤 모달 닫기
                    } else {
                      setShowMotion(false); // ✅ 삭제 실패 시 애니메이션 모달 숨김
                    }
                  }, 900); // ✅ 애니메이션 지속 시간 0.9초
                }}
              >
                먹어버리기
              </DeleteButton>
            </ButtonContainer>
          </ModalContainer>
        </Overlay>
      ) : (
        // ✅ 삭제 요청 성공한 경우에만 실행되는 애니메이션 모달
        <DeleteMotionModal
          isOpen={isDeleteSuccess}
          onClose={() => {
            setShowMotion(false);
            onClose(); // ✅ 애니메이션 종료 후 기본 모달 닫기
          }}
          toastNumber={toastNumber} // ✅ 선택된 toastNumber 전달
        />
      )}
    </>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  width: 280px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.6);

  /* glass */
  backdrop-filter: blur(4px);
`;

const Message = styled.div`
  color: var(--black, #171612);
  padding-top: 20px;
  text-align: center;

  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 125% */
`;

const MessageSmall = styled.p`
  width: 240px;
  color: var(--black, #171612);
  text-align: center;

  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  opacity: 0.4;
  margin-top: 0;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  width: 100px;
  height: 40px;
  padding: 12px 32px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 40px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: var(--black, #171612);
  text-align: center;
  text-overflow: ellipsis;
  font-family: 'SUIT Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 16px; /* 100% */
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 40px;
  display: flex;
  width: 120px;
  height: 40px;
  padding: 12px 11px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: var(--caramel, #974b00);
  text-align: center;
  text-overflow: ellipsis;
  font-family: 'SUIT Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 16px; /* 100% */
`;
