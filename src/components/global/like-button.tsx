"use client";

import { useState } from "react";

export function LikeButton({
  liked,
  onToggle,
}: {
  liked: boolean;
  onToggle: () => void;
}) {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    onToggle();
    setTimeout(() => setAnimate(false), 1000);
  };

  return (
    <div
      title="Like"
      className="relative w-[50px] h-[50px] cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {!liked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 22"
            className="absolute stroke-rose-500 fill-none w-8 h-8"
            strokeWidth={2}
          >
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3 6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
          </svg>
        )}

        {liked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 22"
            className={`absolute fill-rose-500 w-8 h-8 transition-transform ${
              animate ? "animate-heart-pop" : ""
            }`}
          >
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3 6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
          </svg>
        )}

        {/* Celebrate particles */}
        {liked && animate && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="absolute stroke-rose-500 fill-rose-500 stroke-[2px] animate-particle-pop"
          >
            <polygon points="10,10 20,20" />
            <polygon points="10,50 20,50" />
            <polygon points="20,80 30,70" />
            <polygon points="90,10 80,20" />
            <polygon points="90,50 80,50" />
            <polygon points="80,80 70,70" />
          </svg>
        )}
      </div>
    </div>
  );
}
