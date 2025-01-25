/**
 * 파일명: page.tsx
 * 작성일: 2025-01-25
 * 작성자: 이유진
 * 설명: 마이페이지 임시 화면 구현.
 */

"use client";

import React, { useState } from 'react';
import styled from 'styled-components'; 
import styles from './MyPage.module.css'; // styled-components로 변환 후 삭제 예정

interface MyPageProps {
  userEmail: string; // 사용자의 이메일 주소를 props로 전달
  isPremiumUser: boolean; // 사용자가 유료 사용자 여부
}

const MyPage: React.FC<MyPageProps> = ({ userEmail, isPremiumUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState({
    top: "카테고리 1",
    right: "카테고리 2",
    bottom: "카테고리 3",
    left: "카테고리 4",
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState("");

  // 기본값 설정
  const displayedEmail = userEmail || "test@example.com";
  const userPlan = isPremiumUser ? "유료 플랜 이용중" : "무료 플랜 이용중";

  const toggleMyPage = () => {
    setIsOpen((prev) => !prev);
  };

  const startEditing = (position: string) => {
    setEditingCategory(position);
    setTempCategoryName(categories[position as keyof typeof categories]);
  };

  const saveCategory = () => {
    if (editingCategory) {
      setCategories({
        ...categories,
        [editingCategory]: tempCategoryName,
      });
      setEditingCategory(null);
      setTempCategoryName("");
    }
  };

  return (
    <div className={styles.container}>
      {/* Toggle MyPage Button */}
      <button onClick={toggleMyPage} className={styles.toggleButton}>
        {isOpen ? '닫기' : '열기'}
      </button>

      {/* MyPage */}
      <div
        className={
          isOpen
            ? `${styles.myPage} ${styles.open}`
            : `${styles.myPage} ${styles.closed}`
        }
      >
        <div className={styles.email}>{displayedEmail}</div>
        <div className={styles.plan}>{userPlan}</div>

        {/* Menu */}
        <div className={styles.circularMenu}>
          <img src="/4-radial_menu.png" alt="Circular Menu" className={styles.circularMenuImage} />
          <div className={styles.menuItems}>
            {Object.entries(categories).map(([position, name]) => (
              <div
                key={position}
                className={`${styles.menuItem} ${styles[position]} ${
                  editingCategory === position ? styles.editing : ""
                }`}
                onClick={() => startEditing(position)}
              >
                {editingCategory === position ? (
                  <input
                    type="text"
                    value={tempCategoryName}
                    onChange={(e) => setTempCategoryName(e.target.value)}
                    onBlur={saveCategory}
                    className={styles.inlineInput}
                  />
                ) : (
                  <span>{name}</span>
                )}
              </div>
            ))}
          </div>
          <button className={styles.centerButton} onClick={() => startEditing("center")}>
            <img src="/iconbutton.png" alt="Edit Button" />
          </button>
        </div>

        {/* Icon Buttons */}
        <div className={styles.iconButtons}>
          <div className={styles.iconButton}>
            <img src="/icon_profile.png" alt="계정 아이콘" className={styles.icon} />
            <span className={styles.buttonLabel}>계정</span>
          </div>
          <div className={styles.iconButton}>
            <img src="/icon_card.png" alt="플랜 아이콘" className={styles.icon} />
            <span className={styles.buttonLabel}>플랜</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;