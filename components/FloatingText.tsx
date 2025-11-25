import React, { useEffect, useState } from 'react';

interface FloatingTextProps {
  x: number;
  y: number;
  text: string;
  onComplete: () => void;
}

const FloatingText: React.FC<FloatingTextProps> = ({ x, y, text, onComplete }) => {
  const [opacity, setOpacity] = useState(1);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTranslateY(-50);
    }, 50);

    const cleanup = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none text-temple-gold font-bold font-serif text-lg z-50 transition-all duration-1000 ease-out"
      style={{
        left: x,
        top: y,
        opacity: opacity,
        transform: `translate(-50%, ${translateY}px)`
      }}
    >
      {text}
    </div>
  );
};

export default FloatingText;
