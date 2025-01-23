import Link from 'next/link.js';

export default function Home() {
  return (
    <div>
      <div>기본 메인 화면: Figma 상의 start 화면</div>
      <Link href="/pages/loadToastPage">
        <div>load 페이지 링크</div>
      </Link>
    </div>
  );
}
