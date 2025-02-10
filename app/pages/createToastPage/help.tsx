/**
 * 파일명: help.tsx
 * 작성일: 2025-01-30
 * 작성자: 이서연
 * 설명: help 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import SaveGestureIcon from '../../assets/gestures/press_one.svg';
import OpenGestureIcon from '../../assets/gestures/press_double.svg';
import SlideLtoR from '../../assets/gestures/slide_LtoR.svg';
import SlideRtoL from '../../assets/gestures/slide_RtoL.svg';
import IconProfile from '../../assets/icons/icon_profile.svg';

interface HelpProps {
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ onClose }) => {
  const [showNextButton, setShowNextButton] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNextButton(true);
      setShowCloseButton(true); // 2초 후에 두 버튼 모두 나타남
    }, 2000);

    return () => clearTimeout(timer); // 타이머 정리
  }, [step]); // step 변경될 때마다 실행

  // "계속하기" 버튼 클릭 시 다음 도움말로 이동
  const handleNextStep = () => {
    if (step < 1) {
      setStep((prev) => prev + 1);
      setShowNextButton(false); // 버튼 숨겼다가 다시 2초 후 표시
      setShowCloseButton(false);
    } else {
      onClose(); // 마지막 단계면 도움말 닫기
    }
  };

  return (
    <Overlay>
      <ModalContent>
        {step === 0 && (
          <>
            <SaveGesture src={SaveGestureIcon} alt="SaveGesture" width={80} height={80} />
            <HelpText>
              <P>꾹 누른 채 이동</P>
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
            {showNextButton && <Button onClick={handleNextStep}>계속하기</Button>}
          </>
        )}

        {step === 1 && (
          <>
            <StyledIconProfile src={IconProfile} alt="IconProfile" />
            <StyledProfileHelpText>
              <HelpText>
                브래드 박스의
                <br />
                <Strong>이름을 변경</Strong>해요.
              </HelpText>
            </StyledProfileHelpText>

            <DisplayFlex>
              <Display1>
                <SlideLtoRGesture src={SlideLtoR} alt="SlideLtoRGesture" width={80} height={80} />
                <HelpText>
                  <Strong>새 토스트</Strong>를 <br />
                  추가해요.
                </HelpText>
              </Display1>
              <Display2>
                <SlideRtoLGesture src={SlideRtoL} alt="SlideRtoLGesture" width={80} height={80} />
                <HelpText>
                  <Strong>작성 중인</Strong>
                  <br />
                  <Strong>토스트</Strong>를<br />
                  확인해요.
                </HelpText>
              </Display2>
            </DisplayFlex>
            {showCloseButton && <CloseButton onClick={onClose}>도움말 닫기</CloseButton>}
          </>
        )}
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
  color: var(--ivory, #e5dcca);
  text-align: center;
  align-items: center;
  justify-content: center;
  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 111.111% */
`;

const Display1 = styled.div`
  position: absolute;
  left: 16px;
`;
const Display2 = styled.div`
  position: absolute;
  right: 32px;
`;

const DisplayFlex = styled.div`
  display: flex;
`;

const StyledIconProfile = styled(Image)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const StyledProfileHelpText = styled.div`
  position: absolute;
  top: 40px;
  right: 36px;
`;

const HelpText = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  position: absolute;
  top: 571px;
  left: 24px;
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

  animation: fadein 3s cubic-bezier(0, 0, 0.58, 1);
  -webkit-animation: fadein 3s cubic-bezier(0, 0, 0.58, 1);

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 571px;
  left: 24px;
  width: 328px;
  height: 40px;
  text-align: center;
  font-family: 'SUIT', sans-serif;
  margin-top: 70px;
  border: 1px solid #e5dcca;
  background: var(--ivory, #e5dcca);
  color: var(--black, #171612);
  border-radius: 40px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;

  animation: fadein 3s cubic-bezier(0, 0, 0.58, 1);
  -webkit-animation: fadein 3s cubic-bezier(0, 0, 0.58, 1);

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const SaveGesture = styled(Image)``;
const OpenGesture = styled(Image)``;
const SlideLtoRGesture = styled(Image)``;
const SlideRtoLGesture = styled(Image)``;

const Strong = styled.strong`
  color: #ff7f00;
  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

const P = styled.p`
  color: var(--ivory, #e5dcca);
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 112.5% */
  opacity: 0.5;
`;
