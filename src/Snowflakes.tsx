import React from 'react';

interface SnowflakesProps {
  enabled: boolean;
}

const Snowflakes: React.FC<SnowflakesProps> = ({ enabled }) => {
  if (!enabled) return null;

  // Генерируем снежинки с разными характеристиками
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2, // размер от 2px до 8px
    left: Math.random() * 100, // позиция от 0% до 100% внутри контейнера
    duration: Math.random() * 10 + 10, // длительность падения от 10s до 20s
    delay: Math.random() * 20, // задержка старта от 0s до 20s
    opacity: Math.random() * 0.6 + 0.4, // прозрачность от 0.4 до 1.0
  }));

  return (
    <div className="fixed top-0 right-0 bottom-0 left-20 pointer-events-none z-40">
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="absolute animate-fall"
          style={{
            left: `${snowflake.left}%`,
            width: `${snowflake.size}px`,
            height: `${snowflake.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: snowflake.opacity,
            animationDuration: `${snowflake.duration}s`,
            animationDelay: `${snowflake.delay}s`,
            boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)',
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(calc(100vh + 10px));
          }
        }

        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Snowflakes;
