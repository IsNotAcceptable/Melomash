import React, { useEffect, useState } from 'react';

interface SnowFlake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface SnowProps {
  enabled: boolean;
}

const Snow: React.FC<SnowProps> = ({ enabled }) => {
  const [snowflakes, setSnowflakes] = useState<SnowFlake[]>([]);

  useEffect(() => {
    if (!enabled) {
      setSnowflakes([]);
      return;
    }

    // Создаем снежинки
    const createSnowflakes = () => {
      const flakes: SnowFlake[] = [];
      const count = 50; // количество снежинок

      for (let i = 0; i < count; i++) {
        flakes.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1, // размер от 1 до 4px
          speed: Math.random() * 2 + 0.5, // скорость от 0.5 до 2.5
          opacity: Math.random() * 0.8 + 0.2, // прозрачность от 0.2 до 1
        });
      }

      setSnowflakes(flakes);
    };

    // Анимируем снежинки
    const animateSnow = () => {
      setSnowflakes(prevFlakes =>
        prevFlakes.map(flake => {
          let newY = flake.y + flake.speed;
          let newX = flake.x + Math.sin(flake.y * 0.01) * 0.5; // легкое горизонтальное движение

          // Если снежинка ушла за нижнюю границу, перемещаем ее наверх
          if (newY > window.innerHeight) {
            newY = -10;
            newX = Math.random() * window.innerWidth;
          }

          // Если снежинка ушла за боковые границы, переносим на другую сторону
          if (newX > window.innerWidth) {
            newX = 0;
          } else if (newX < 0) {
            newX = window.innerWidth;
          }

          return {
            ...flake,
            x: newX,
            y: newY,
          };
        })
      );
    };

    createSnowflakes();

    const animationId = setInterval(animateSnow, 50); // 20 FPS

    // Обработка изменения размера окна
    const handleResize = () => {
      createSnowflakes();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          style={{
            position: 'absolute',
            left: flake.x,
            top: flake.y,
            width: flake.size,
            height: flake.size,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: flake.opacity,
            boxShadow: `0 0 ${flake.size}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
};

export default Snow;
