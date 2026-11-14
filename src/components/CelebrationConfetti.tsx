import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface CelebrationConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({
  active,
  onComplete,
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={360}
        recycle={false}
        gravity={0.24}
        initialVelocityX={{ min: -14, max: 14 }}
        initialVelocityY={{ min: -22, max: 6 }}
        confettiSource={{
          x: dimensions.width / 2 - 40,
          y: dimensions.height * 0.35,
          w: 80,
          h: 20,
        }}
        colors={[
          '#10b981', // Emerald
          '#34d399', // Mint
          '#fbbf24', // Amber Gold
          '#f59e0b', // Deep Gold
          '#38bdf8', // Sky
          '#f43f5e', // Fruit Berry Rose
          '#ffffff', // Sparkle White
        ]}
        onConfettiComplete={() => {
          if (onComplete) onComplete();
        }}
      />
    </div>
  );
};
