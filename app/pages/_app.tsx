// 공통 레이아웃 및 상태 설정 
import { AppProps } from 'next/app';
import { EmailProvider } from '../context/EmailContext'; 

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EmailProvider>
      <Component {...pageProps} />
    </EmailProvider>
  );
}

export default MyApp;