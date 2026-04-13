
"use client";

import React, { useEffect, useState, useRef } from "react";
import { FrameCanvas } from "@/components/SkillBridge/FrameCanvas";
import { SkillAnalyzer } from "@/components/SkillBridge/SkillAnalyzer";
import { RoadmapItem } from "@/components/SkillBridge/RoadmapItem";
import { ArrowDown, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SkillBridgeLanding() {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / height;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showHero = scrollProgress < 0.2;
  const showAnalyzer = scrollProgress > 0.25 && scrollProgress < 0.65;
  const showRoadmap = scrollProgress > 0.7;

  return (
    <div ref={containerRef} className="relative bg-[#0A0510]" style={{ height: '400vh' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center">
        <div className="text-white font-bold text-xl tracking-tight">SkillBridge</div>
        <button 
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
        >
          <LogIn className="w-4 h-4" /> Login / Get Started
        </button>
      </nav>

      <FrameCanvas scrollProgress={scrollProgress} />

      <div className="relative z-10 w-full">
        <section className={`fixed inset-0 flex flex-col items-center justify-center px-6 transition-all duration-1000 ${showHero ? 'opacity-100' : 'opacity-0 pointer-events-none -translate-y-12'}`}>
          <div className="max-w-4xl text-center space-y-8">
            <h1 className="text-7xl md:text-9xl font-headline font-extrabold tracking-tighter text-white">
              Bridge the <br /> 
              <span className="text-primary purple-glow">Career Path</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
              Navigate your professional trajectory with high-fidelity <br /> skill-gap visualization.
            </p>
            <div className="pt-12 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                <ArrowDown className="text-white/40 w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Scroll to Explore</span>
            </div>
          </div>
        </section>

        <div className="h-[200vh] pointer-events-none" />

        <section className="min-h-[150vh] px-6 md:px-24 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="sticky top-24 pointer-events-none">
              <h2 className={`text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter transition-all duration-700 ${showRoadmap ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Visualizing <br /> <span className="text-accent">The Staircase</span>
              </h2>
              <p className={`mt-6 text-white/40 max-w-sm leading-relaxed transition-all duration-1000 delay-200 ${showRoadmap ? 'opacity-100' : 'opacity-0'}`}>
                As you ascend, the system identifies real-time pivot points based on emerging industry demands.
              </p>
            </div>
            
            <div className="space-y-12 pt-24 md:pt-0">
              <RoadmapItem 
                title="Foundation Phase" 
                description="Consolidate core competencies in modern architecture. Your current stack puts you in the top 15% of candidates for Lead Engineering roles."
                progress={0.7}
                active={scrollProgress > 0.72}
              />
              <RoadmapItem 
                title="Management Pivot" 
                description="Strategically shift towards product ownership by bridging the gap between technical execution and business requirements."
                progress={0.85}
                active={scrollProgress > 0.82}
              />
              <RoadmapItem 
                title="Visionary State" 
                description="The final milestone. Lead organizational change through high-level design systems and strategic leadership."
                progress={1.0}
                active={scrollProgress > 0.92}
              />
            </div>
          </div>
        </section>
      </div>

      <SkillAnalyzer 
        isVisible={showAnalyzer} 
        onAnalysisComplete={(res) => {
          if(res){
            console.log('Analysis result:', res)
          }
        }} 
      />

      <div className="h-48 flex items-center justify-center text-white/20 text-xs font-bold tracking-[0.4em] uppercase">
        SkillBridge &copy; 2024
      </div>
    </div>
  );
}
