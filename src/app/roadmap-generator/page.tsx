"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Loader2, Save, CheckCircle2, Target, Code2 } from "lucide-react";
import { initializeFirebase } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface RoadmapStep {
  step: string;
  skills: string[];
}

interface RoadmapData {
  baseline_recognized: string;
  target_role: string;
  roadmap: {
    Foundation: RoadmapStep[];
    Ascent: RoadmapStep[];
    Mastery: RoadmapStep[];
  };
}

export default function RoadmapGenerator() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [prismaUserId, setPrismaUserId] = useState<string | null>(null);
  
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  
  const [isComputing, setIsComputing] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { auth } = initializeFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email) {
        setUser(currentUser);
        // Sync with Prisma to get the DB user ID
        try {
          const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
          });
          if (res.ok) {
            const dbUser = await res.json();
            setPrismaUserId(dbUser.id);
          }
        } catch (err) {
          console.error("Failed to sync user:", err);
        }
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSkills || !targetRole) return;
    
    setIsComputing(true);
    setError("");
    setRoadmapData(null);
    setIsSaved(false);

    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSkills, targetRole })
      });

      if (!res.ok) throw new Error("Failed to generate roadmap");
      
      const data = await res.json();
      setRoadmapData(data);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while generating your roadmap. Please try again.");
    } finally {
      setIsComputing(false);
    }
  };

  const handleSave = async () => {
    if (!roadmapData || !prismaUserId) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: prismaUserId,
          currentSkillset: currentSkills,
          targetRole: targetRole,
          roadmapData: roadmapData
        })
      });

      if (!res.ok) throw new Error("Failed to save roadmap");
      setIsSaved(true);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save roadmap.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

      <nav className="mb-12 max-w-5xl mx-auto relative z-10">
        <button 
          onClick={() => router.push("/user-dashboard")}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </nav>

      <main className="max-w-5xl mx-auto relative z-10">
        {!roadmapData && !isComputing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1c1c1e] border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)] mb-6">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold mb-4 tracking-tight">AI Roadmap Generator</h1>
              <p className="text-gray-400">
                Define your starting point and destination. Our engine will calculate the optimal path.
              </p>
            </div>

            <div className="bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Skills & Experience</label>
                  <div className="relative">
                    <Code2 className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g., Junior React Developer, basic JS, HTML, CSS, Tailwind..."
                      value={currentSkills}
                      onChange={(e) => setCurrentSkills(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Target Role</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      required
                      type="text"
                      placeholder="e.g., Senior Frontend Architect"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={!currentSkills || !targetRole}
                  className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Generate Trajectory
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {isComputing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-purple-400/50 rounded-full animate-spin animation-delay-150"></div>
              <div className="absolute inset-4 border-b-2 border-white/20 rounded-full animate-spin animation-delay-300"></div>
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Computing Trajectory</h2>
            <p className="text-gray-400 animate-pulse">Analyzing skill gaps and industry demands...</p>
          </motion.div>
        )}

        {roadmapData && !isComputing && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pb-24"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Your Career Trajectory</h1>
                <p className="text-purple-400 font-medium text-lg">{roadmapData.target_role}</p>
                <p className="text-gray-400 mt-2 max-w-2xl text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                  Baseline: {roadmapData.baseline_recognized}
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className="flex items-center gap-2 bg-[#1c1c1e] border border-white/10 hover:bg-white/10 text-white py-3 px-6 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
                {isSaved ? "Saved to Profile" : "Save to Profile"}
              </button>
            </div>

            {/* Asymmetrical Vertical Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Central Line */}
              <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-white/10 to-transparent -translate-x-1/2" />

              {['Foundation', 'Ascent', 'Mastery'].map((phaseName, phaseIndex) => {
                const phaseSteps = roadmapData.roadmap[phaseName as keyof typeof roadmapData.roadmap] || [];
                
                return (
                  <div key={phaseName} className="mb-24 relative">
                    <div className="sticky top-6 z-20 flex justify-start md:justify-center mb-12">
                      <div className="bg-black border border-white/10 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                        <span className="text-purple-400 mr-2">0{phaseIndex + 1}</span> {phaseName}
                      </div>
                    </div>

                    <div className="space-y-12">
                      {phaseSteps.map((step, stepIndex) => {
                        const isEven = stepIndex % 2 === 0;
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: stepIndex * 0.1 }}
                            key={stepIndex} 
                            className={`relative flex flex-col md:flex-row items-start gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
                          >
                            {/* Timeline Node */}
                            <div className="absolute left-[28px] md:left-1/2 w-3 h-3 bg-black border-2 border-purple-500 rounded-full -translate-x-1/2 mt-6 z-10 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            
                            {/* Spacer for alternating layout */}
                            <div className="hidden md:block md:w-1/2" />

                            {/* Card */}
                            <div className="w-full pl-16 md:pl-0 md:w-1/2">
                              <div className={`bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-[#1c1c1e]/80 transition-colors ${isEven ? 'md:mr-12' : 'md:ml-12'}`}>
                                <h3 className="text-xl font-semibold mb-4 text-white">{step.step}</h3>
                                <div className="flex flex-wrap gap-2">
                                  {step.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
