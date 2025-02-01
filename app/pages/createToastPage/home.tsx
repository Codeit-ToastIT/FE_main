/**
 * 파일명: home.tsx
 * 작성일: 2025-01-24
 * 작성자: 이서연
 * 설명: header, body 스타일 수정.
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Header from '../../components/layout/header';
import Body from '../../components/common/body';
import iconAdd from '../../assets/icons/icon_add.svg';

interface HomeProps {
  onHelpClick: () => void;
}

export default function Home({ onHelpClick }: HomeProps) {
  const router = useRouter();
  const onProfileClick = () => {
    router.push(`/pages/myPage`);
  };

  const searchParams = useSearchParams();
  const [showDeletedMessage, setShowDeletedMessage] = useState(false);
  const [showDeleteErrorMessage, setShowDeleteErrorMessage] = useState(false);
  const [deletedMemoId, setDeletedMemoId] = useState<string | null>(null); // ✅ 삭제된 메모 ID 상태 추가

  useEffect(() => {
    if (searchParams.get('deleted') === 'true') {
      setShowDeletedMessage(true);
      setTimeout(() => setShowDeletedMessage(false), 2000);
    }
    if (searchParams.get('deletedError') === 'true') {
      setShowDeleteErrorMessage(true);
      setTimeout(() => setShowDeleteErrorMessage(false), 2000);
    }

    // ✅ 삭제된 메모 ID 가져오기
    const memoId = searchParams.get('deletedMemoId');
    if (memoId) {
      setDeletedMemoId(memoId);
    }
  }, [searchParams]);

  return (
    <div>
      <StyledHeader title="TOAST IT" onHelpClick={onHelpClick} onProfileClick={onProfileClick} />
      <IconAdd src={iconAdd} alt="Add" />

      {/* ✅ Body에 deletedMemoId 전달 */}
      <StyledBody deletedMemoId={deletedMemoId} />
    </div>
  );
}

const StyledHeader = styled(Header)`
  width: 375px;
  height: 56px;
  background: var(--black, #171612);
  box-sizing: border-box;
`;

const IconAdd = styled(Image)`
  position: absolute;
  top: 40%;
  left: 20%;
  transform: 'translate(-40%, -20%)'
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  opacity: 0.9;
`;

const DeletedMessage = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1000;
  animation: fadeInOut 2s ease-in-out;
`;

const ErrorMessageBox = styled.div`
  background: rgba(255, 0, 0, 0.8);
`;

const StyledBody = styled(Body)`
  width: 375px;
  height: 579px;
  border-radius: 40px 0px 0px 40px;
  background: #fff;
  box-sizing: border-box;
`;
