import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';


const slideAndBounce = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    type: 'spring',
    stiffness: 1067,
    damping: 20,
    mass: 1,
    delay: 0.3
  },
};

const slideUp = {
  initial: { y: 0 },
  animate: { y: -50 }, 
  transition: {
    duration: 0.5,
    delay: 0.5 
  },
};

const AnimatedDiv = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 0.2rem;
`;

interface ToastLogoProps {
  onAnimationComplete: () => void;
}

const ToastLogo: React.FC<ToastLogoProps> = ({onAnimationComplete}) => {
  return (
    <AnimatedDiv
      initial={slideAndBounce.initial}
      animate={slideAndBounce.animate}
      transition={slideAndBounce.transition}
      onAnimationComplete={onAnimationComplete}
    >
      
      <svg width="160" height="85" viewBox="0 0 160 85" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M27.4639 53.712H17.7199V84.288H11.4799V53.712H1.63989V48.384H27.4639V53.712Z" fill="#E5DCCA"/>
          <path d="M46.0931 79.248C48.4611 79.248 50.5411 78.72 52.3331 77.664C54.1251 76.608 55.5011 75.104 56.4611 73.152C57.4531 71.2 57.9491 68.928 57.9491 66.336C57.9491 63.744 57.4531 61.472 56.4611 59.52C55.5011 57.568 54.1251 56.064 52.3331 55.008C50.5411 53.92 48.4611 53.376 46.0931 53.376C43.7251 53.376 41.6451 53.92 39.8531 55.008C38.0931 56.064 36.7171 57.568 35.7251 59.52C34.7651 61.472 34.2851 63.744 34.2851 66.336C34.2851 68.928 34.7651 71.2 35.7251 73.152C36.7171 75.104 38.0931 76.608 39.8531 77.664C41.6451 78.72 43.7251 79.248 46.0931 79.248ZM46.0931 48C49.5811 48 52.6851 48.784 55.4051 50.352C58.1571 51.888 60.3011 54.048 61.8371 56.832C63.3731 59.616 64.1411 62.784 64.1411 66.336C64.1411 69.888 63.3731 73.056 61.8371 75.84C60.3011 78.624 58.1571 80.8 55.4051 82.368C52.6851 83.904 49.5811 84.672 46.0931 84.672C42.6051 84.672 39.5011 83.904 36.7811 82.368C34.0611 80.8 31.9331 78.624 30.3971 75.84C28.8611 73.056 28.0931 69.888 28.0931 66.336C28.0931 62.784 28.8611 59.616 30.3971 56.832C31.9331 54.048 34.0611 51.888 36.7811 50.352C39.5011 48.784 42.6051 48 46.0931 48Z" fill="#E5DCCA"/>
          <path d="M99.3773 84.288H92.8013L89.3933 74.88H75.5213L71.9693 84.288H65.3933L78.7853 48.384H86.2733L99.3773 84.288ZM87.4253 69.552L82.5293 56.112L77.4893 69.552H87.4253Z" fill="#E5DCCA"/>
          <path d="M106.447 73.536C107.535 75.584 108.735 77.072 110.047 78C111.359 78.928 112.703 79.392 114.079 79.392C116.255 79.392 117.887 78.944 118.975 78.048C120.095 77.12 120.655 75.872 120.655 74.304C120.655 73.344 120.351 72.528 119.743 71.856C119.135 71.184 118.367 70.64 117.439 70.224C116.543 69.776 115.279 69.264 113.647 68.688C111.407 67.888 109.567 67.12 108.127 66.384C106.719 65.616 105.503 64.544 104.479 63.168C103.487 61.76 102.991 59.952 102.991 57.744C102.991 55.76 103.487 54.032 104.479 52.56C105.471 51.088 106.847 49.968 108.607 49.2C110.367 48.4 112.383 48 114.655 48C117.023 48 119.279 48.704 121.423 50.112C123.567 51.52 125.167 53.648 126.223 56.496L120.751 58.464C120.047 56.64 119.167 55.328 118.111 54.528C117.055 53.728 115.935 53.312 114.751 53.28C113.023 53.28 111.663 53.696 110.671 54.528C109.679 55.36 109.183 56.432 109.183 57.744C109.183 58.704 109.487 59.536 110.095 60.24C110.735 60.912 111.519 61.472 112.447 61.92C113.375 62.368 114.655 62.912 116.287 63.552C118.495 64.416 120.303 65.232 121.711 66C123.119 66.736 124.319 67.792 125.311 69.168C126.303 70.544 126.799 72.272 126.799 74.352C126.799 76.368 126.287 78.16 125.263 79.728C124.239 81.296 122.767 82.512 120.847 83.376C118.959 84.24 116.735 84.672 114.175 84.672C111.519 84.672 109.103 83.968 106.927 82.56C104.783 81.12 102.943 79.072 101.407 76.416L106.447 73.536Z" fill="#E5DCCA"/>
          <path d="M156.651 53.712H146.907V84.288H140.667V53.712H130.827V48.384H156.651V53.712Z" fill="#E5DCCA"/>
      </svg>
      
    </AnimatedDiv>
  );
};

const Splash: React.FC<{onAnimationComplete: () => void}> = ({onAnimationComplete}) => {
  const [slide, setSlide] = useState(false);

  const handleAnimationComplete = () => {
    setSlide(true);
    onAnimationComplete();
  };
  
  return (
    <motion.div
      initial={slideUp.initial}
      animate={slide ? slideUp.animate : slideUp.initial}
      transition={slideUp.transition}
    >
      <ToastLogo onAnimationComplete={handleAnimationComplete}/>
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="40" viewBox="0 0 160 40" fill="none">
        <rect width="160" height="40" fill="#171612"/>
        <path d="M17.8399 2V37.904H11.6479V2H17.8399Z" fill="#E5DCCA"/>
        <path d="M157.464 7.328H147.72V37.904H141.48V7.328H131.64V2H157.464V7.328Z" fill="#E5DCCA"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M125 23.28H26.9999V18.2803H125V23.28Z" fill="#E5DCCA"/>
      </svg>   
    </motion.div>
  );
};

export default Splash;
