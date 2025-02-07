import styled from "styled-components";

const StyledButton = styled.input.withConfig({
  shouldForwardProp: (prop) => !['isActive'].includes(prop)
})<{ isActive: boolean }>`
  width: 20.5rem;
  display: flex;
  height: 2.5rem;
  border-radius: 2.5rem;
  border: 1px solid var(--ivory, #E5DCCA);
  background-color: ${({ isActive }) => (isActive ? '#E5DCCA' : 'transparent')};
  color: ${({ isActive }) => (isActive ? '#171612' : '#E5DCCA')};
  opacity: ${({ isActive }) => (isActive ? '1' : '0.2')};
  text-align: center;
  font-family: SUIT;
  font-size: 1rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  cursor: pointer;
`;

interface SubmitButtonProps {
  isActive: boolean;
  onClick?: () => void; 
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isActive, onClick }) => {
  return (
    <StyledButton 
      type="submit" 
      value="계속하기" 
      isActive={isActive} 
      disabled={!isActive} 
      onClick={onClick} 
    />
  );
};

export default SubmitButton;