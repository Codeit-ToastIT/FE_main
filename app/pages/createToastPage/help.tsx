import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import SaveGestureIcon from '../../assets/icons/save_gesture_icon.png';
import OpenGestureIcon from '../../assets/icons/open_gesture_icon.png';

interface HelpProps {
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ onClose }) => {
  return (
    <Overlay>
      <ModalContent>
        <SaveGesture src={SaveGestureIcon} alt="SaveGesture" width={80} height={80} />
        <HelpText>
          <P>꾹 누른채 이동</P>
          작성한 토스트를 <br />
          브래드 박스에 <Strong>저장</Strong>해요.
        </HelpText>
        <OpenGesture src={OpenGestureIcon} alt="OpenGesture" width={80} height={80} />
        <HelpText>
          <P>
            두 번 탭하고 <br />꼭 누른 채 이동
          </P>
          브레드 박스를 <Strong>열어요.</Strong>
        </HelpText>
        <Button onClick={onClose}>계속하기</Button>
      </ModalContent>
    </Overlay>
  );
};

export default Help;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* 어두운 배경 효과 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: transparent;
  border-radius: 12px;

  text-align: center;

  color: #e5dcca;
  font-family: 'SUIT', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
`;

const HelpText = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 328px;
  height: 40px;
  text-align: center;
  font-family: 'SUIT', sans-serif;
  margin-top: 70px;
  border: 1px solid #e5dcca;
  background: none;
  color: #e5dcca;
  border-radius: 40px;
  cursor: pointer;
  font-size: 18px;
`;

const SaveGesture = styled(Image)``;
const OpenGesture = styled(Image)``;

const Strong = styled.strong`
  color: #ff7f00;
`;

const P = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  font-family: 'SUIT';
`;
