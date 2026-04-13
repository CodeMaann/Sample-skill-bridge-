"use client";

import React, { useState } from "react";
import { Loader2, Upload, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SkillAnalyzerProps {
  isVisible: boolean;
  onAnalysisComplete: (results: any) => void;
}

export const SkillAnalyzer: React.FC<SkillAnalyzerProps> = ({ isVisible, onAnalysisComplete }) => {
  const [isComputing, setIsComputing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnalyze = async () => {
    setIsComputing(true);
    try {
      // Simulate complex analysis processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In real app, we would push to firestore here:
      // await addDoc(collection(db, 'analyses'), { timestamp: new Date(), ...data });
      
      setIsComputing(false);
      setIsFinished(true);
      onAnalysisComplete({ gap: 0.15, nextSkill: "Advanced React Design Systems" });
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsComputing(false);
    }
  };

  if (!isVisible && !isFinished) return null;

  return (
    <div 
      className={`fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 transition-all duration-700 ease-out z-30 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <Card className="glass-panel silver-border border-white/20 bg-black/40 backdrop-blur-3xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-headline tracking-tighter flex items-center gap-2">
            {isFinished ? (
              <span className="text-primary flex items-center gap-2">
                Analysis Complete <CheckCircle2 className="w-5 h-5" />
              </span>
            ) : (
              "Skill-Gap Analyzer"
            )}
          </CardTitle>
          <CardDescription className="text-white/60">
            {isFinished 
              ? "Your personalized career roadmap has been updated based on current market trends." 
              : "Upload your resume or link your LinkedIn to calculate your trajectory."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {isComputing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center space-y-2">
                <p className="text-primary font-medium tracking-wide animate-pulse">Computing Trajectory...</p>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full computing-gradient w-full" />
                </div>
              </div>
            </div>
          ) : isFinished ? (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">Skill Match</p>
                  <p className="text-3xl font-headline font-bold text-primary">85%</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">Growth Index</p>
                  <p className="text-3xl font-headline font-bold text-accent">+12.4%</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/5 border border-white/10 group">
                View Full Roadmap <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-3 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-medium text-white/60">Drop resume here or click to browse</p>
                </div>
              </div>
              <Button 
                onClick={handleAnalyze}
                className="w-full py-6 text-lg font-headline tracking-tighter bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary))]"
              >
                Initiate Bridge Phase
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
