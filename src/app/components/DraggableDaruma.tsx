'use client'

import { useState, useRef, useEffect } from 'react'
import { DarumaSvg } from './DarumaSvg'

interface DraggableDarumaProps {
  containerSize: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function DraggableDaruma({ containerSize, containerRef }: DraggableDarumaProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const darumaRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const darumaSize = containerSize * 0.2

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newX = Math.min(Math.max(clientX - containerRect.left - offset.current.x, 0), containerSize - darumaSize);
      const newY = Math.min(Math.max(clientY - containerRect.top - offset.current.y, 0), containerSize - darumaSize);
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      isDragging.current = false
    }

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove as EventListener);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [containerSize, darumaSize])

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // タッチデバイスでのスクロールを防止
    isDragging.current = true;
    const containerRect = containerRef.current?.getBoundingClientRect();
    const darumaRect = darumaRef.current?.getBoundingClientRect();
    if (containerRect && darumaRect) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      offset.current = {
        x: clientX - darumaRect.left,
        y: clientY - darumaRect.top
      };
    }
  };

  return (
    <div
      ref={darumaRef}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: 'move',
        touchAction: 'none',
        width: `${darumaSize}px`,
        height: `${darumaSize}px`
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <DarumaSvg width={darumaSize} height={darumaSize} />
    </div>
  )
}
