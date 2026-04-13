"use client";

import React from "react";

interface RoadmapItemProps {
  title: string;
  description: string;
  progress: number;
  active: boolean;
}

export const RoadmapItem: React.FC<RoadmapItemProps> = ({ title, description, active }) => {
  return (
    <div 
      className={`transition-all duration-1000 transform ${
        active 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-12 opacity-0 scale-95"
      } mb-24 max-w-sm ml-auto`}
    >
      <div className="glass-panel silver-border p-8 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-2xl font-headline font-bold mb-4 tracking-tighter text-white">
          {title}
        </h3>
        <p className="text-white/60 leading-relaxed text-sm font-light">
          {description}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/80">Phase Active</span>
        </div>
      </div>
    </div>
  );
};