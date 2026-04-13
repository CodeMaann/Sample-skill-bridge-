"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Users, TrendingUp, ShieldAlert, LogOut, Loader2 } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalRoadmaps: number;
  trendingRoles: { role: string; count: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic client-side protection
    if (sessionStorage.getItem("isAdmin") !== "true") {
      router.push("/login");
      return;
    }
    setIsAuthorized(true);

    // Fetch stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    router.push("/");
  };

  if (!isAuthorized) return null;

  const maxRoleCount = stats?.trendingRoles.length 
    ? Math.max(...stats.trendingRoles.map(r => r.count)) 
    : 1;

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none" />

      <nav className="flex justify-between items-center mb-16 max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <span className="font-bold text-xl tracking-tight">Admin Console</span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Exit Console
        </button>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-12 tracking-tight">System Overview</h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-red-400 animate-spin mb-4" />
              <p className="text-gray-400">Loading system statistics...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-gray-400 font-medium">Total Users</h3>
                  </div>
                  <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
                </div>

                <div className="bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/10">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-gray-400 font-medium">Roadmaps Generated</h3>
                  </div>
                  <p className="text-4xl font-bold">{stats?.totalRoadmaps || 0}</p>
                </div>
              </div>

              <div className="bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-h-[300px] shadow-2xl">
                <h2 className="text-xl font-semibold mb-8">Trending Target Roles</h2>
                
                {stats?.trendingRoles && stats.trendingRoles.length > 0 ? (
                  <div className="space-y-6">
                    {stats.trendingRoles.map((role, index) => (
                      <div key={index} className="relative">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-200">{role.role}</span>
                          <span className="text-gray-500">{role.count} searches</span>
                        </div>
                        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(role.count / maxRoleCount) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-red-500/50 to-red-400 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-500">
                    No roadmap data available yet.
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
