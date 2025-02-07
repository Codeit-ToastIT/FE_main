"use client";

import Image from 'next/image';
import { styled } from "styled-components";
import vector from "./assets/icons/Vector.svg";
import ellipse7 from "./assets/icons/Ellipse 7.svg";
import ellipse8 from "./assets/icons/Ellipse 8.svg";
import bread from "./assets/icons/bread1.png";
import { useRouter } from "next/navigation";

const Whole = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ImageError = styled.div`
  position: relative; // 자식 요소의 절대 위치 지정을 위해 relative 설정
  width: 23.4375rem;
  height: 39.6875rem;
  flex-shrink: 0;
`

const Vector = styled(Image)`
  position: absolute;
  top: 13.26rem;
  left: 6.06rem;
`
const Ellipse7 = styled(Image)`
  position: absolute;
  top: 13rem;
  left: 9.3rem;
`
const Ellipse8 = styled(Image)`
  position: absolute;
  top: 13.75rem;
  left: 10.13rem;
`
const Bread = styled(Image)`
  position: absolute;
  top: 13.86rem;
  left: 10.32rem;
`

const P = styled.div`
  color: var(--ivory, #E5DCCA);
  text-align: center;
  font-family: SUIT;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const Button = styled.button`
  display: flex;
  position: absolute;
  top: 32.06rem;
  width: 5.75rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  cursor: pointer; // 커서 포인터로 변경
  overflow: hidden;
  color: var(--black, #171612);
  text-align: center;
  text-overflow: ellipsis;
  font-family: SUIT;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1rem; /* 100% */
  border-radius: 2.5rem;
  background: var(--mocha-category, #806952);
  border: none;
    &:hover {
      background: var(--ivory, #E5DCCA);
    }
`

const Container = styled.div`
  position: absolute;
  top: 22.75rem;
`

export default function NotFound() {
  const router = useRouter();
  
  const goHome = () => {
    router.push('/');
  }
  return (
    <Whole>
      <ImageError>
        <Vector src={vector} alt="Vector" objectFit="contain" />
        <Ellipse7 src={ellipse7} alt="Ellipse 7" layout="fixed" objectFit="contain" />
        <Ellipse8 src={ellipse8} alt="Ellipse 8" layout="fixed" objectFit="contain" />
        <Bread src={bread} alt="Bread" layout="fixed" objectFit="contain" />
      </ImageError>
      <Container>
      <P>존재하지 않는 주소를 입력했거나,</P>
      <P>요청한 페이지의 주소가</P>
      <P>변경 또는 삭제 되었어요.</P>
      </Container>
      <Button onClick={goHome}>홈으로</Button>
    </Whole>
  )
}
