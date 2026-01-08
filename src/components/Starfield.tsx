import React, { useEffect, useState } from 'react';

interface StarfieldProps {
  enabled: boolean;
  density?: number; // количество звезд (20-100)
  speed?: number; // скорость движения (1-5)
  particleCount?: number; // количество звезд
  animationSpeed?: number; // скорость анимации
}

const Starfield: React.FC<StarfieldProps> = ({
  enabled,
  density = 50,
  speed = 2,
  particleCount = 50,
  animationSpeed = 2
}) => {
  if (!enabled) return null;

  // Генерируем звезды с разными характеристиками
  const stars = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1, // размер от 1px до 4px
    left: Math.random() * 100, // позиция от 0% до 100%
    top: Math.random() * 100, // позиция от 0% до 100%
    duration: (Math.random() * 50 + 50) / animationSpeed, // длительность анимации от 50s до 100s, зависит от скорости
    delay: Math.random() * 100, // задержка старта от 0s до 100s
    brightness: Math.random() * 0.8 + 0.2, // яркость от 0.2 до 1.0
    twinkleSpeed: Math.random() * 3 + 2, // скорость мерцания от 2s до 5s
  }));

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-30 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: star.brightness,
            animationDuration: `${star.twinkleSpeed}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.6)`,
          }}
        />
      ))}

      {/* Анимированные метеоры */}
      {Array.from({ length: Math.floor(density / 10) }, (_, i) => (
        <div
          key={`meteor-${i}`}
          className="absolute animate-meteor"
          style={{
            left: `${Math.random() * 120 - 20}%`,
            top: `${Math.random() * 50}%`,
            width: '2px',
            height: '2px',
            backgroundColor: 'white',
            borderRadius: '50%',
            animationDuration: `${Math.random() * 10 + 15}s`,
            animationDelay: `${Math.random() * 30}s`,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes meteor {
          0% {
            transform: translateX(-20px) translateY(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(120vw + 20px)) translateY(100px);
            opacity: 0;
          }
        }

        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }

        .animate-meteor {
          animation: meteor linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Starfield;
