import styled from 'styled-components';
import { LuChevronsUpDown } from 'react-icons/lu';
import { renderToStaticMarkup } from 'react-dom/server';

// Convert the icon to a data URL
const iconString = encodeURIComponent(renderToStaticMarkup(<LuChevronsUpDown />));
const iconDataUrl = `data:image/svg+xml,${iconString}`;

const NoneText = styled.div`
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height */

  /* ivory */
  color: #e5dcca;
`;

const ScrollBar = styled.div`
  width: 500px;
  height: 200px;
  margin: 0 auto;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: url(${iconDataUrl}) no-repeat center center;
    background-size: contain;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: white;
    border-radius: 10px;
  }
`;

// ...existing code...
