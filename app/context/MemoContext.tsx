import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: string;
  name: string;
}

interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: number;
  category: Category;
  notes: Memo[]; // ✅ 배열 형태로 수정
}

interface MemoContextType {
  memos: Memo[];
  fetchMemos: (categoryId: string) => Promise<void>;
}

const MemoContext = createContext<MemoContextType | undefined>(undefined);

export function MemoProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [memos, setMemos] = useState<Memo[]>([]);

  const fetchMemos = async (categoryId: string) => {
    try {
      console.log(`🔗 요청 URL: ${API_BASE_URL}/api/categories/${categoryId}/memos`);

      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}/memos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('❌ 메모 불러오기 실패');
      }

      const data: ApiResponse = await response.json(); // ✅ `ApiResponse` 타입 적용
      console.log('✅ 메모 가져오기 성공:', data);

      // ✅ `notes` 배열이 존재하면, 그 데이터를 `memos` 상태로 저장
      if (data.notes && Array.isArray(data.notes)) {
        setMemos(data.notes); // ✅ 최대 3개만 저장하고 싶다면: `data.notes.slice(0, 3);`
      } else {
        setMemos([]); // ✅ `notes`가 없으면 빈 배열로 초기화
      }
    } catch (error) {
      console.error('❌ 메모 불러오기 오류:', error);
    }
  };

  return <MemoContext.Provider value={{ memos, fetchMemos }}>{children}</MemoContext.Provider>;
}

export function useMemoContext() {
  const context = useContext(MemoContext);
  if (!context) {
    throw new Error('useMemoContext must be used within a MemoProvider');
  }
  return context;
}
