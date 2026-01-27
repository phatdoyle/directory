"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

export function SafeImage({
  fallbackText,
  alt,
  className,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-punk-blue">
        <div className="flex flex-col items-center gap-2 text-white opacity-60">
          {/* Broken image icon */}
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth={2}
              d="M4 16l4-4 4 4 4-4 4 4M4 20h16M4 4h16v12H4z"
            />
            <path
              strokeLinecap="square"
              strokeWidth={2}
              d="M14 8h.01M14 8a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          {fallbackText && (
            <span className="text-xs font-bold uppercase tracking-wider">
              {fallbackText}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
