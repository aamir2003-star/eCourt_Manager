// src/components/BounceText.jsx - FIXED (No Infinite Loop)
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const BounceText = ({ text, className = "", style = {} }) => {
  const containerRef = useRef();
  const animationDone = useRef(false);

  useEffect(() => {
    if (!containerRef.current || animationDone.current) return;

    const words = containerRef.current.querySelectorAll('.bounce-word');
    if (words.length === 0) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const tl = gsap.timeline();

      words.forEach((word, index) => {
        tl.from(
          word,
          {
            y: -30,
            opacity: 0,
            duration: 0.6,
            ease: 'bounce.out',
          },
          index * 0.08
        );
      });

      animationDone.current = true;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={className} style={style}>
      {words.map((word, index) => (
        <span
          key={index}
          className="bounce-word inline-block mr-1"
          style={{
            display: 'inline-block',
            color: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default BounceText;
