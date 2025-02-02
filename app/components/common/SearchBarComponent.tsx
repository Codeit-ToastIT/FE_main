import React from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';

interface SearchComponentProps {
  searchToast: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBarComponent: React.FC<SearchComponentProps> = ({ searchToast, onChange }) => {
  return (
    <SearchContainer>
      <BackButton>
        <IoIosArrowBack className="back" />
      </BackButton>
      <SearchBar placeholder="검색어를 입력해주세요" onChange={onChange} value={searchToast} />
      <FiSearch className="glasses" size={22} />
    </SearchContainer>
  );
};

export default SearchBarComponent;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .back {
    color: #e5dcca;
  }
  .glasses {
    color: #e5dcca;
    position: absolute;
    right: 9em;
  }
`;

const SearchBar = styled.input`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #171612;
  border-radius: 40px;
  border-width: 0;
  padding: 13px;
  width: 303px;

  &::placeholder {
    font-family: 'SUIT';
    font-style: normal;
    font-weight: 800;
    font-size: 16px;

    display: flex;
    align-items: center;
    opacity: 0.2;
  }
  color: #e5dcca;
`;

const BackButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  /* black */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #171612;
  display: flex;
  justify-content: center;
  align-items: center;
`;