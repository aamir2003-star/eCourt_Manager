// src/components/AnimatedGradientText.jsx
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const AnimatedGradientText = ({ text, className = "" }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.gradient-word');
    if (words.length === 0) return;

    // Create timeline that repeats infinitely
    const tl = gsap.timeline({ repeat: -1, yoyo: false });

    // Animate each word with a flowing gradient effect
    words.forEach((word, index) => {
      tl.to(
        word,
        {
          color: '#C9C7BA',
          textShadow: '0 0 20px rgba(201, 199, 186, 0.8)',
          duration: 0.4,
          ease: 'power2.inOut',
        },
        index * 0.15 // Each word starts after the previous one
      );

      // Reset color back to original
      tl.to(
        word,
        {
          color: '#b3b1a0',
          textShadow: '0 0 0px rgba(201, 199, 186, 0)',
          duration: 0.3,
          ease: 'power2.inOut',
        },
        `+0.05` // Small delay before reset
      );
    });

    return () => {
      tl.kill();
    };
  }, [text]);

  const words = text.split('');

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className="gradient-word"
          style={{
            display: 'inline-block',
            color: '#b3b1a0',
            fontWeight: 'bold',
            fontSize: 'inherit',
            transition: 'all 0.3s ease',
            marginRight: word === ' ' ? '0.5rem' : '0.05rem',
          }}
        >
          {word === ' ' ? '\u00A0' : word}
        </span>
      ))}
    </div>
  );
};

export default AnimatedGradientText;
