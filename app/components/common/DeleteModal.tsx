import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onConfirm: () => void;
  onClick: () => void;
}
//onConfirm
export default function Modal({ isOpen, onClose, onClick }: ModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Message>
          이 토스트를 버릴까요?
          <br />
          <MessageSmall>먹은 토스트는 삭제돼요.</MessageSmall>
        </Message>

        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <DeleteButton onClick={onClick}>먹어버리기</DeleteButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
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
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 125% */
`;

const MessageSmall = styled.p`
  width: 240px;
  color: var(--black, #171612);
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  opacity: 0.4;
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
  width: 92px;
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
  font-family: SUIT;
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
  width: 92px;
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
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 16px; /* 100% */
`;
