import React, { useState } from "react";
import { UserInput } from "../types";
import { ArrowRight, Activity } from "lucide-react";
import { motion } from "motion/react";

interface FormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export function Form({ onSubmit, isLoading }: FormProps) {
  const [formData, setFormData] = useState<UserInput>({
    age: "",
    goal: "",
    habits: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.age && formData.goal && formData.habits) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] mb-6">
          <Activity className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight mb-4">
          Life Timeline Simulator
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Visualize how your daily habits compound over the next 5 years. Discover the difference between the status quo and a 1% daily improvement.
        </p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/10 blur-[100px] pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label htmlFor="age" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Current Age</label>
            <input
              type="number"
              id="age"
              required
              min="10"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || "" })}
              className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 font-mono focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              placeholder="e.g., 28"
            />
          </div>

          <div>
            <label htmlFor="goal" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Primary Goal</label>
            <input
              type="text"
              id="goal"
              required
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 font-mono focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              placeholder="e.g., Run a marathon, Save $20,000, Start a business"
            />
          </div>

          <div>
            <label htmlFor="habits" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Current Daily Habits</label>
            <textarea
              id="habits"
              required
              rows={4}
              value={formData.habits}
              onChange={(e) => setFormData({ ...formData, habits: e.target.value })}
              className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 font-mono focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none"
              placeholder="e.g., Scroll social media for 2 hours, drink $6 coffee, sleep 6 hours..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-4 px-6 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Simulating Futures...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Simulate My Future
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
