
"use client";

import React, { useEffect, useRef, useState } from "react";

interface FrameCanvasProps {
  scrollProgress: number;
}

export const FrameCanvas: React.FC<FrameCanvasProps> = ({ scrollProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalFrames = 60;
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animation Refs for LERP
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    // Preload frames
    let loadedCount = 0;
    const frames: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `https://picsum.photos/seed/skillframe-${i}/1920/1080`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      frames.push(img);
    }
    framesRef.current = frames;
  }, []);

  // Update target frame when scroll progress changes
  useEffect(() => {
    targetFrameRef.current = scrollProgress * (totalFrames - 1);
  }, [scrollProgress]);

  // Buttery smooth LERP animation loop with snappier factor
  useEffect(() => {
    if (!isLoaded) return;

    const animate = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      
      if (context && canvas) {
        // LERP logic: Factor updated to 0.08 for slightly snappier chasing
        currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.08;
        
        const frameIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(currentFrameRef.current))
        );

        const img = framesRef.current[frameIndex];
        if (img) {
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;
          
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#0A0510]">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-60"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="text-primary animate-pulse font-headline tracking-widest uppercase text-xs">
            Initializing Sequence...
          </div>
        </div>
      )}
    </div>
  );
};
