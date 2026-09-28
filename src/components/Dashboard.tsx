import React, { useState } from "react";
import { SimulationResult, UserInput, MicroHabitItem } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCcw, TrendingDown, TrendingUp, Zap, Activity, CheckCircle2, Sparkles, Target } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  data: SimulationResult;
  input?: UserInput | null;
  onReset: () => void;
}

export function Dashboard({ data, input, onReset }: DashboardProps) {
  const [committed, setCommitted] = useState<Record<number, boolean>>({});

  const toggleCommit = (idx: number) => {
    setCommitted(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const parseHabit = (item: string | MicroHabitItem) => {
    if (typeof item === "object" && item !== null) {
      return {
        action: item.action || "",
        howToImprove: item.howToImprove || "",
      };
    }
    return {
      action: String(item),
      howToImprove: "",
    };
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#080808] p-6 rounded-2xl border border-zinc-800 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] shrink-0">
            <Activity className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tight">Life Timeline Simulator</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500">System Status: <span className="text-cyan-400 font-mono">Analysis Complete</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-zinc-500">
          {input?.age && (
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[10px]">Age</span>
              <span className="text-white font-mono font-semibold">{input.age} Years</span>
            </div>
          )}
          {input?.goal && (
            <div className="flex flex-col max-w-[200px]">
              <span className="text-zinc-500 text-[10px]">Core Goal</span>
              <span className="text-white font-mono font-semibold truncate" title={input.goal}>{input.goal}</span>
            </div>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl transition-colors border border-zinc-700 shadow-sm w-fit group text-xs uppercase tracking-widest font-bold"
          >
            <RefreshCcw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500" />
            New Simulation
          </button>
        </div>
      </div>

      {/* Narratives */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-orange-500/50 flex flex-col shadow-lg shadow-orange-950/10 justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Path A: The Default Path
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Status Quo</span>
            </div>
            <p className="text-zinc-200 text-base leading-relaxed">
              "{data.narrativeA}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[11px] text-zinc-500 font-mono">
            Trajectory: Gradual stagnation over 5 years
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 p-6 rounded-2xl border-l-4 border-cyan-500/50 flex flex-col shadow-lg shadow-cyan-950/10 justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-cyan-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Path B: The 1% Compound
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold">+1% Daily Focus</span>
            </div>
            <p className="text-zinc-200 text-base leading-relaxed">
              "{data.narrativeB}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[11px] text-cyan-400 font-mono">
            Trajectory: Exponential growth & goal mastery
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 relative"
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-xl font-serif text-white">Compound Growth Trajectory</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Status Quo vs. 1% Daily Improvement over 5 Years</p>
          </div>
          <div className="flex gap-4 text-[10px] uppercase tracking-tighter">
            <span className="flex items-center gap-2 text-zinc-400"><div className="w-3 h-1 bg-cyan-500"></div>Path B (1% Compound)</span>
            <span className="flex items-center gap-2 text-zinc-400"><div className="w-3 h-1 bg-orange-500"></div>Path A (Status Quo)</span>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="#71717a" 
                tickFormatter={(value) => value === 0 ? "Today" : `Year ${value}`}
                tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                dx={-10}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#f4f4f5', fontSize: '13px', padding: '4px 0', fontFamily: 'monospace' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                labelFormatter={(value) => value === 0 ? "Baseline: Today" : `Timeline Phase: Year ${value}`}
              />
              <Line 
                type="monotone" 
                name="Status Quo (Path A)"
                dataKey="pathA" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#050505', stroke: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316', style: { filter: 'drop-shadow(0 0 5px rgba(249,115,22,0.5))' } }}
              />
              <Line 
                type="monotone" 
                name="1% Compound Growth (Path B)"
                dataKey="pathB" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#050505', stroke: '#06b6d4', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#06b6d4', style: { filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))' } }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Timeline Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden"
      >
        <div className="p-4 px-6 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-white text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            5-Year Milestones Side-by-Side
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">Year 1 · Year 3 · Year 5+</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/30 text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800">
                <th className="px-6 py-3 font-medium w-28">Milestone</th>
                <th className="px-6 py-3 font-medium border-l border-zinc-800 text-orange-400">Path A: Status Quo</th>
                <th className="px-6 py-3 font-medium border-l border-zinc-800 text-cyan-400">Path B: +1% Compound</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-sm">
              {data.timeline.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-zinc-400 whitespace-nowrap align-top font-bold text-xs">
                    Year {item.year}{item.year >= 5 ? '+' : ''}
                  </td>
                  <td className="px-6 py-4 text-zinc-300 leading-relaxed align-top">
                    {item.pathA}
                  </td>
                  <td className="px-6 py-4 text-white leading-relaxed align-top">
                    {item.pathB}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Micro-Habits: What to do tomorrow exactly & How it improves */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900 p-6 md:p-8 rounded-2xl border border-zinc-800"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-white text-base font-semibold uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              What to Do Tomorrow (Exact 3 Steps)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Simple, non-overwhelming actions to start your 1% compound streak immediately.</p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full w-fit">
            Ready to commit
          </span>
        </div>

        <ul className="grid md:grid-cols-3 gap-6">
          {data.microHabits.map((item, idx) => {
            const parsed = parseHabit(item);
            const isCommitted = !!committed[idx];

            return (
              <li 
                key={idx}
                className={`flex flex-col justify-between p-5 rounded-xl border transition-all ${
                  isCommitted 
                    ? "bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 flex items-center justify-center font-mono text-[11px] font-bold">
                      0{idx + 1}
                    </span>
                    <button 
                      type="button"
                      onClick={() => toggleCommit(idx)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                        isCommitted 
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60" 
                          : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCommitted ? "text-cyan-400" : "text-zinc-500"}`} />
                      <span>{isCommitted ? "Committed" : "Commit"}</span>
                    </button>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                      Action Tomorrow:
                    </span>
                    <p className="text-sm text-zinc-100 font-medium leading-snug">
                      {parsed.action}
                    </p>
                  </div>

                  {parsed.howToImprove && (
                    <div className="pt-3 border-t border-zinc-800/70 text-xs text-zinc-300 leading-relaxed">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3" />
                        How it improves your trajectory:
                      </span>
                      <p className="text-zinc-300">
                        {parsed.howToImprove}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
