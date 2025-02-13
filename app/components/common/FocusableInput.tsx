// components/FocusableInput.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  height: 2.5rem;
  min-width: 20.5rem;
  border-radius: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  outline: none;
  color: #e5dcca;
  padding-left: 1rem;
  overflow: hidden;
  color: var(--ivory, #e5dcca);
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

interface FocusableInputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoComplete?: string;
}

const FocusableInput = React.forwardRef<HTMLInputElement, FocusableInputProps>(
  ({ type = 'text', name, placeholder, value, onChange, onBlur, autoComplete }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    // 컴포넌트가 마운트될 때 입력 필드에 포커스
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    // 마우스 클릭 시 커서 이동
    const handleMouseDown = (event: React.MouseEvent) => {
      event.preventDefault(); // 기본 동작 방지

      const input = inputRef.current;
      if (input) {
        const { offsetX } = event.nativeEvent; // 클릭한 위치의 X 좌표
        const clickedPosition = getCursorPosition(input, offsetX); // 커서 위치 계산

        input.focus();
        input.setSelectionRange(clickedPosition, clickedPosition); // 커서 위치 설정
      }
    };

    // 클릭한 위치에 해당하는 커서 위치 계산
    const getCursorPosition = (input: HTMLInputElement, offsetX: number) => {
      const value = input.value;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) return 0;

      // 입력 필드의 폰트 스타일 가져오기
      const font = window.getComputedStyle(input).font;
      context.font = font;

      // 평균 문자 너비 계산
      const textWidth = context.measureText(value).width;
      const averageCharWidth = textWidth / value.length;

      // 클릭한 위치에 해당하는 문자 인덱스 계산
      return Math.round(offsetX / averageCharWidth);
    };

    return (
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        onMouseDown={handleMouseDown}
      />
    );
  },
);

FocusableInput.displayName = 'FocusableInput';

export default FocusableInput;
