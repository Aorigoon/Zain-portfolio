'use client';
import React, { useState } from 'react';
import {
  motion,
  VariantLabels,
  Target,
  TargetAndTransition,
  Transition,
} from 'motion/react';

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
    exit: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
  };
  onAnimationComplete?: () => void;
};

function WordRoll({
  word,
  duration,
  getEnterDelay,
  getExitDelay,
  transition,
  variants,
  defaultVariants,
  onAnimationComplete,
}: any) {
  const [isHovered, setIsHovered] = useState(false);
  const letters = word.split('');

  return (
    <span
      className="inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter: string, i: number) => {
        return (
          <span
            key={i}
            className='relative inline-block [perspective:10000px] [transform-style:preserve-3d] [width:auto]'
            aria-hidden='true'
          >
            <motion.span
              className='absolute inline-block [backface-visibility:hidden] [transform-origin:50%_25%]'
              initial={variants?.enter?.initial ?? defaultVariants.enter.initial}
              animate={isHovered ? (variants?.enter?.animate ?? defaultVariants.enter.animate) : (variants?.enter?.initial ?? defaultVariants.enter.initial)}
              transition={{
                ...transition,
                duration,
                delay: getEnterDelay(i),
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
            <motion.span
              className='absolute inline-block [backface-visibility:hidden] [transform-origin:50%_100%]'
              initial={variants?.exit?.initial ?? defaultVariants.exit.initial}
              animate={isHovered ? (variants?.exit?.animate ?? defaultVariants.exit.animate) : (variants?.exit?.initial ?? defaultVariants.exit.initial)}
              transition={{
                ...transition,
                duration,
                delay: getExitDelay(i),
              }}
              onAnimationComplete={
                letters.length === i + 1 ? onAnimationComplete : undefined
              }
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
            <span className='invisible'>
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.05,
  getExitDelay = (i) => i * 0.05 + 0.1,
  className,
  transition = { ease: 'easeIn' },
  variants,
  onAnimationComplete,
}: TextRollProps) {
  const defaultVariants = {
    enter: {
      initial: { rotateX: 0 },
      animate: { rotateX: 90 },
    },
    exit: {
      initial: { rotateX: -90 },
      animate: { rotateX: 0 },
    },
  } as const;

  const words = children.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <WordRoll
            word={word}
            duration={duration}
            getEnterDelay={getEnterDelay}
            getExitDelay={getExitDelay}
            transition={transition}
            variants={variants}
            defaultVariants={defaultVariants}
            onAnimationComplete={i === words.length - 1 ? onAnimationComplete : undefined}
          />
          {i < words.length - 1 && <span>&nbsp;</span>}
        </React.Fragment>
      ))}
      <span className='sr-only'>{children}</span>
    </span>
  );
}
