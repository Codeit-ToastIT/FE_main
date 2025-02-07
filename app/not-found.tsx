"use client";

import Image from 'next/image';
import { styled } from "styled-components";
import { useRouter } from "next/navigation";
import Error from "./assets/icons/404Error.png";

const Whole = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ImageError = styled(Image)`
  position: absolute;
  top: 12.5rem;
  left: 5.5rem;
  width: 12.5rem;
  height: auto;
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
      <ImageError src={Error} alt="404Error"/>
      <Container>
      <P>존재하지 않는 주소를 입력했거나,</P>
      <P>요청한 페이지의 주소가</P>
      <P>변경 또는 삭제 되었어요.</P>
      </Container>
      <Button onClick={goHome}>홈으로</Button>
    </Whole>
  )
}
