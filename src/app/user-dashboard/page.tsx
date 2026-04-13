"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass, LogOut, Loader2 } from "lucide-react";
import { initializeFirebase } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function UserDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { auth } = initializeFirebase();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    const { auth } = initializeFirebase();
    await signOut(auth);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex justify-between items-center mb-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1c1c1e] border border-white/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-purple-400" />
          </div>
          <span className="font-bold text-xl tracking-tight">SkillBridge</span>
        </div>
        <button 
          onClick={handleSignOut}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </nav>

      <main className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back.</h1>
          <p className="text-gray-400 mb-12">Ready to map out your next career move?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => router.push("/roadmap-generator")}
              className="col-span-1 md:col-span-2 bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer hover:bg-[#1c1c1e] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-purple-600/20 transition-colors" />
              
              <h2 className="text-2xl font-semibold mb-4 relative z-10">Generate New Roadmap</h2>
              <p className="text-gray-400 mb-8 max-w-md relative z-10">
                Input your current skills and target role. Our AI engine will construct a step-by-step path to get you there.
              </p>
              
              <div className="flex items-center gap-2 text-purple-400 font-medium relative z-10">
                Start Generator <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div className="bg-[#1c1c1e]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="font-medium mb-1">Saved Roadmaps</h3>
              <p className="text-sm text-gray-500">You have no saved roadmaps yet.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
